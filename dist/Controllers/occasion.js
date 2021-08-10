"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccasionController = void 0;
class OccasionController {
    notifyPlayer(client, userId, title, description, channel) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client.users.fetch(userId);
            const invite = yield channel.createInvite();
            const dm = (_a = user.dmChannel) !== null && _a !== void 0 ? _a : yield user.createDM();
            dm.send(client.embeds.notification(title, description, invite.url));
        });
    }
    Start(client, guild, author, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == author.id);
            if (!occasion)
                throw Error("Only host has permission to start an event");
            if (!title)
                throw Error("Event name must be provided");
            yield client.database.updateOccasion(guild.id, occasion.voiceChannel, {
                Title: title,
                startedAt: new Date,
                description: description
            });
            if (server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if (!channel || !channel.isText)
                    return;
                const voiceChannel = guild.channels.cache.get(occasion.voiceChannel);
                if (!voiceChannel)
                    throw Error("Cannot find voice channel");
                yield channel.send(client.embeds.occasionStarted(title, description, author.username, voiceChannel.members.size));
            }
        });
    }
    Finish(client, guild, author, results) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == author.id);
            if (!occasion)
                throw Error("Only host has permission to finish an event");
            const voice = guild.channels.cache.get(occasion.voiceChannel);
            const text = guild.channels.cache.get(occasion.textChannel);
            if (!text)
                throw Error("Text channel has been removed, personal statistic will not be updated.");
            if (!voice)
                throw Error("Voice channel has been removed, personal statistic will not be updated.");
            yield client.ratingController.updateMembers(client, voice);
            yield client.database.removeOccasion(server.guild, occasion.voiceChannel);
            yield text.send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
            if (server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if (!channel || !channel.isText)
                    return;
                channel.send(client.embeds.occasionFinished(results, author.username, voice.members.size));
            }
        });
    }
    Announce(client, title, description, guild, author) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == author.id);
            if (!occasion)
                throw Error("Only host has permission to start an event.");
            if (!server.settings.notification_channel)
                throw Error("Notification channel was not set up.");
            const channel = guild.channels.cache.get(server.settings.notification_channel);
            const hashtags = client.helper.findSubscriptions(description);
            if (!channel || !channel.isText)
                throw Error("Cannot find notification channel.");
            yield channel.send(client.embeds.occasionNotification(title, description, author.username));
            if (hashtags.length > 0) {
                hashtags.forEach(tag => {
                    this.NotifyPlayers(client, tag, channel, title, description);
                });
            }
        });
    }
    NotifyPlayers(client, tagId, channel, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield client.database.getTag(tagId);
            if (!tag)
                throw Error("There are no subscriptions for this tag");
            const players = yield tag.subscribers;
            yield Promise.all(players.map((player) => __awaiter(this, void 0, void 0, function* () { return yield this.notifyPlayer(client, player.id, title, description, channel); })));
        });
    }
}
exports.OccasionController = OccasionController;
