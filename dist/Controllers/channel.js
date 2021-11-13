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
exports.leftHandler = exports.joinHandler = void 0;
const room_1 = require("../Managers/room");
function createChannelJoined(client, member, server, database, room, joinedChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = member.guild.channels.cache.get(server.eventCategory);
        if (channel == undefined)
            return;
        const { voice, text } = yield room.create(member.user, channel, server.settings.black_list);
        if (member.guild.channels.cache.size >= 499)
            throw new Error("Channel limit reached");
        if (server.settings.occasion_limit && server.events.length + 1 >= server.settings.occasion_limit)
            yield joinedChannel.permissionOverwrites.edit(member.guild.roles.everyone, { 'CONNECT': false });
        yield member.voice.setChannel(voice).catch(() => {
            room.delete(client, server, voice.guild, voice.id, text.id);
            return;
        });
        yield database.addOccasion(member.guild.id, {
            voiceChannel: voice.id,
            textChannel: text.id,
            initiator: member.id,
            state: room_1.OccasionState.waiting,
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
            yield createChannelJoined(client, member, server, client.database, client.room, joinedChannel);
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
                state: room_1.OccasionState.voting
            });
            yield text.send({ embeds: [client.embeds.voting(server.settings.limit)] });
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
            yield client.room.delete(client, server, leftChannel.guild, occasion.voiceChannel, occasion.textChannel);
        }
    });
}
exports.leftHandler = leftHandler;
