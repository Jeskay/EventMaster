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
const Error_1 = require("../Error");
const room_1 = require("../Managers/room");
class OccasionController {
    notifyPlayer(client, userId, title, description, channel) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client.users.fetch(userId);
            const invite = yield channel.guild.invites.create(channel);
            const dm = (_a = user.dmChannel) !== null && _a !== void 0 ? _a : yield user.createDM();
            dm.send({
                embeds: [client.embeds.notification(title, description, invite.url, (_b = channel.guild.bannerURL()) !== null && _b !== void 0 ? _b : undefined)],
                components: [client.embeds.InviteMessage(invite.url, channel.guild.name)]
            });
        });
    }
    declareHost(client, occasion, candidate, voiceChannel, textChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            client.vote.finish(voiceChannel.id);
            if (!occasion)
                return;
            client.room.givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, candidate);
            yield client.database.updateOccasion(voiceChannel.guild.id, voiceChannel.id, {
                state: room_1.OccasionState.playing,
                host: candidate.id
            });
            textChannel.send({ embeds: [client.embeds.electionFinished(candidate.user.username)] });
        });
    }
    vote(client, voiceChannel, voterId, candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = voiceChannel.guild;
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(occasion => occasion.voiceChannel == voiceChannel.id);
            if (!occasion)
                throw new Error_1.CommandError("You must be in event channel to vote.");
            if (occasion.host)
                throw new Error_1.CommandError("There is already a host in this occasion.");
            const textChannel = voiceChannel.guild.channels.cache.get(occasion.textChannel);
            if (!textChannel || !textChannel.isText)
                throw new Error_1.CommandError("Cannot find text channel");
            const candidate = yield guild.members.fetch(candidateId);
            const finished = yield client.vote.vote(voiceChannel.id, voterId, candidateId);
            if (finished) {
                client.occasionController.declareHost(client, occasion, candidate, voiceChannel, textChannel);
            }
            else
                yield textChannel.send({ embeds: [client.embeds.voteConfimation(candidate.user.username)] });
        });
    }
    start(client, guild, author, title, description) {
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
                    return client.embeds.occasionFinishResponse(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
                const voiceChannel = guild.channels.cache.get(occasion.voiceChannel);
                if (!voiceChannel)
                    throw Error("Cannot find voice channel");
                yield channel.send({ embeds: [client.embeds.occasionStarted(title, description, author.username, voiceChannel.members.size)] });
            }
            return client.embeds.occasionStartResponse(title, description);
        });
    }
    finish(client, guild, author, results) {
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
            yield text.send({ embeds: [client.embeds.finishedOccasion], components: [client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`)] });
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
            const duration = (new Date()).getMinutes() - occasion.startedAt.getMinutes();
            if (server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if (!channel || !channel.isText)
                    return client.embeds.occasionFinishResponse(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
                channel.send({ embeds: [client.embeds.occasionFinished(results, author.username, duration, voice.members.size)] });
            }
            return client.embeds.occasionFinishResponse(occasion.Title, duration);
        });
    }
    announce(client, description, guild, author, title, image) {
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
            const eventRole = server.settings.event_role;
            yield channel.send({
                content: eventRole ? `<@&${eventRole}>` : "",
                embeds: [client.embeds.occasionNotification(title, description, author.username, image)]
            });
            if (hashtags.length > 0) {
                hashtags.forEach(tag => {
                    this.notifyPlayers(client, tag, channel, title !== null && title !== void 0 ? title : tag, description);
                });
            }
            return client.embeds.announcePublishedResponse(hashtags);
        });
    }
    notifyPlayers(client, tagId, channel, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield client.database.getTag(tagId);
            if (!tag)
                return;
            const players = yield tag.subscribers;
            yield Promise.all(players.map((player) => __awaiter(this, void 0, void 0, function* () { return yield this.notifyPlayer(client, player.id, title, description, channel); })));
        });
    }
}
exports.OccasionController = OccasionController;
