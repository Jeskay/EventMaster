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
exports.notifyPlayers = exports.announce = exports.finish = exports.start = exports.vote = exports.declareHost = void 0;
const discord_js_1 = require("discord.js");
const Error_1 = require("../Error");
const Controllers_1 = require("../Controllers");
const Utils_1 = require("../Utils");
const _1 = require(".");
const channel_1 = require("./channel");
const Embeds_1 = require("../Embeds");
function notifyPlayer(client, userId, title, description, channel) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield client.users.fetch(userId);
        const invite = yield channel.guild.invites.create(channel);
        const dm = (_a = user.dmChannel) !== null && _a !== void 0 ? _a : yield user.createDM();
        dm.send({
            embeds: [(0, Embeds_1.notification)(title, description, invite.url, (_b = channel.guild.bannerURL()) !== null && _b !== void 0 ? _b : undefined)],
            components: [(0, Embeds_1.InviteMessage)(invite.url, channel.guild.name)]
        });
    });
}
function declareHost(client, occasion, candidate, voiceChannel, textChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        client.vote.finish(voiceChannel.id);
        if (!occasion)
            return;
        (0, Controllers_1.givePermissions)(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, candidate);
        yield client.database.updateOccasion(voiceChannel.guild.id, voiceChannel.id, {
            state: Controllers_1.OccasionState.waiting,
            host: candidate.id
        });
        textChannel.send({ embeds: [(0, Embeds_1.electionFinished)(candidate.id)] });
    });
}
exports.declareHost = declareHost;
function vote(client, voiceChannel, voterId, candidateId) {
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
            declareHost(client, occasion, candidate, voiceChannel, textChannel);
        }
        else
            yield textChannel.send({ embeds: [(0, Embeds_1.voteConfimation)(candidate.user.username)] });
    });
}
exports.vote = vote;
function start(client, guild, author, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if (!occasion)
            throw Error("Only host has permission to start an event");
        if (occasion.state == Controllers_1.OccasionState.playing)
            throw new Error_1.CommandError("Occasion has already started.");
        if (!title)
            throw Error("Event name must be provided");
        yield client.database.updateOccasion(guild.id, occasion.voiceChannel, {
            Title: title,
            startedAt: new Date,
            state: Controllers_1.OccasionState.playing,
            description: description
        });
        if (server.settings.logging_channel) {
            const channel = guild.channels.cache.get(server.settings.logging_channel);
            if (!channel || !channel.isText)
                return (0, Embeds_1.occasionFinishResponse)(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
            const voiceChannel = guild.channels.cache.get(occasion.voiceChannel);
            if (!voiceChannel)
                throw Error("Cannot find voice channel");
            yield channel.send({ embeds: [(0, Embeds_1.occasionStarted)(title, description, author.username, voiceChannel.members.size)] });
        }
        return (0, Embeds_1.occasionStartResponse)(title, description);
    });
}
exports.start = start;
function finish(client, guild, author, results) {
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
        const duration = (new Date()).getMinutes() - occasion.startedAt.getMinutes();
        yield (0, _1.updateMembers)(client, voice, duration);
        yield client.database.removeOccasion(server.guild, occasion.voiceChannel);
        yield text.send({ embeds: [Embeds_1.finishedOccasion], components: [(0, Embeds_1.HostCommend)(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`)] });
        setTimeout(() => (0, channel_1.deleteChannels)(client, server, guild, occasion.voiceChannel, occasion.textChannel), 10000);
        if (server.settings.logging_channel) {
            const channel = guild.channels.cache.get(server.settings.logging_channel);
            if (!channel || !channel.isText)
                return (0, Embeds_1.occasionFinishResponse)(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
            channel.send({ embeds: [(0, Embeds_1.occasionFinished)(occasion.Title, results, author.username, duration, voice.members.size)] });
        }
        return (0, Embeds_1.occasionFinishResponse)(occasion.Title, duration);
    });
}
exports.finish = finish;
function announce(client, description, guild, author, title, image) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if (!occasion)
            throw Error("Only host has permission to announce an event.");
        if (occasion.announced)
            throw new Error_1.CommandError("Announce has been already published.");
        if (!server.settings.notification_channel)
            throw Error("Notification channel was not set up.");
        const channel = guild.channels.cache.get(server.settings.notification_channel);
        const voiceChannel = yield guild.channels.fetch(occasion.voiceChannel);
        if (!(voiceChannel instanceof discord_js_1.VoiceChannel))
            throw new Error_1.CommandError("Voice channel does not exist.");
        const hashtags = (0, Utils_1.findSubscriptions)(description);
        if (!channel || !channel.isText)
            throw Error("Cannot find notification channel.");
        const eventRole = server.settings.event_role;
        yield channel.send({
            content: eventRole ? `<@&${eventRole}>` : "",
            embeds: [(0, Embeds_1.occasionNotification)(title, description, author.username, image)]
        });
        if (hashtags.length > 0) {
            hashtags.forEach(tag => {
                notifyPlayers(client, tag, voiceChannel, title !== null && title !== void 0 ? title : tag, description);
            });
        }
        yield client.database.updateOccasion(server.guild, occasion.voiceChannel, {
            announced: true
        });
        return (0, Embeds_1.announcePublishedResponse)(hashtags);
    });
}
exports.announce = announce;
function notifyPlayers(client, tagId, channel, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const tag = yield client.database.getTag(tagId);
        if (!tag)
            return;
        const players = yield tag.subscribers;
        console.log(channel.guild);
        yield Promise.all(players.map((player) => __awaiter(this, void 0, void 0, function* () { return yield notifyPlayer(client, player.id, title, description, channel); })));
    });
}
exports.notifyPlayers = notifyPlayers;
