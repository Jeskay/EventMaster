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
exports.leftHandler = exports.joinHandler = exports.checkState = exports.deleteChannels = exports.givePermissions = exports.createChannels = exports.channels = exports.MemberState = exports.OccasionState = void 0;
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../Embeds");
var OccasionState;
(function (OccasionState) {
    OccasionState[OccasionState["voting"] = 0] = "voting";
    OccasionState[OccasionState["waiting"] = 1] = "waiting";
    OccasionState[OccasionState["playing"] = 2] = "playing";
    OccasionState[OccasionState["finished"] = 3] = "finished";
})(OccasionState = exports.OccasionState || (exports.OccasionState = {}));
var MemberState;
(function (MemberState) {
    MemberState[MemberState["joined"] = 0] = "joined";
    MemberState[MemberState["left"] = 1] = "left";
    MemberState[MemberState["moved"] = 2] = "moved";
    MemberState[MemberState["other"] = 3] = "other";
})(MemberState = exports.MemberState || (exports.MemberState = {}));
function channels(guild, text, voice) {
    const voiceChannel = guild.channels.cache.get(voice);
    const textChannel = guild.channels.cache.get(text);
    return { voiceChannel, textChannel };
}
exports.channels = channels;
function createChannels(initiator, category, blacklist) {
    return __awaiter(this, void 0, void 0, function* () {
        let text_permissions = [];
        let voice_permissions = [];
        blacklist.forEach(user => {
            text_permissions.push({
                type: 'member',
                id: user,
                deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.SEND_MESSAGES]
            });
            voice_permissions.push({
                type: 'member',
                id: user,
                deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.CONNECT]
            });
        });
        const voiceChnl = yield category.guild.channels.create(initiator.username, {
            type: "GUILD_VOICE",
            parent: category,
            permissionOverwrites: voice_permissions
        });
        const textChnl = yield category.guild.channels.create(initiator.username, {
            type: "GUILD_TEXT",
            parent: category,
            rateLimitPerUser: 30,
            permissionOverwrites: text_permissions
        });
        return { voice: voiceChnl, text: textChnl };
    });
}
exports.createChannels = createChannels;
function givePermissions(guild, text, voice, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { voiceChannel, textChannel } = channels(guild, text, voice);
        yield voiceChannel.permissionOverwrites.edit(user, {
            MANAGE_CHANNELS: true
        });
        yield textChannel.permissionOverwrites.edit(user, {
            MANAGE_CHANNELS: true
        });
    });
}
exports.givePermissions = givePermissions;
function deleteChannels(client, server, guild, voice, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const { voiceChannel, textChannel } = channels(guild, text, voice);
        yield voiceChannel.delete();
        yield textChannel.delete();
        if (server.settings.occasion_limit && (server.settings.occasion_limit == server.events.length)) {
            const joinChannel = yield client.channels.fetch(server.eventChannel);
            yield joinChannel.permissionOverwrites.edit(guild.roles.everyone, { 'CONNECT': true });
        }
    });
}
exports.deleteChannels = deleteChannels;
function checkState(oldState, newState) {
    if (oldState.channel == newState.channel)
        return MemberState.other;
    if (newState.channel == null)
        return MemberState.left;
    if (oldState.channel == null)
        return MemberState.joined;
    return MemberState.moved;
}
exports.checkState = checkState;
function createChannelJoined(client, member, server, database, joinedChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = member.guild.channels.cache.get(server.eventCategory);
        if (channel == undefined)
            return;
        const { voice, text } = yield createChannels(member.user, channel, server.settings.black_list);
        if (member.guild.channels.cache.size >= 499)
            throw new Error("Channel limit reached");
        if (server.settings.occasion_limit && server.events.length + 1 >= server.settings.occasion_limit)
            yield joinedChannel.permissionOverwrites.edit(member.guild.roles.everyone, { 'CONNECT': false });
        yield member.voice.setChannel(voice).catch(() => {
            deleteChannels(client, server, voice.guild, voice.id, text.id);
            return;
        });
        yield database.addOccasion(member.guild.id, {
            voiceChannel: voice.id,
            textChannel: text.id,
            initiator: member.id,
            state: OccasionState.waiting,
            announced: false,
            server: server
        });
    });
}
function joinHandler(client, member, joinedChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServerRelations(member.guild.id);
        if (server == null)
            return;
        if (server.eventChannel == joinedChannel.id) {
            yield createChannelJoined(client, member, server, client.database, joinedChannel);
            return;
        }
        const occasion = server.events.find(event => event.voiceChannel == joinedChannel.id);
        if (occasion == undefined)
            return;
        if (occasion.host)
            return;
        if (joinedChannel.members.size >= server.settings.limit) {
            const text = joinedChannel.guild.channels.cache.get(occasion.textChannel);
            if (text == undefined || !text.isText)
                return;
            client.vote.start(occasion.voiceChannel, server.settings.limit);
            yield client.database.updateOccasion(joinedChannel.guild.id, joinedChannel.id, {
                state: OccasionState.voting
            });
            yield text.send({ embeds: [(0, Embeds_1.voting)(server.settings.limit)] });
        }
    });
}
exports.joinHandler = joinHandler;
function leftHandler(client, leftChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServerRelations(leftChannel.guild.id);
        if (!server)
            return;
        const occasion = server.events.find(event => event.voiceChannel == leftChannel.id);
        if (!occasion)
            return;
        if (leftChannel != null && leftChannel.members.size == 0) {
            yield client.database.removeOccasion(leftChannel.guild.id, occasion.voiceChannel);
            yield deleteChannels(client, server, leftChannel.guild, occasion.voiceChannel, occasion.textChannel);
        }
    });
}
exports.leftHandler = leftHandler;
