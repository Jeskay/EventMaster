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
exports.event = void 0;
const room_1 = require("../Managers/room");
const room_2 = require("../Managers/room");
exports.event = {
    name: 'voiceStateUpdate',
    run: (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
        if (newState.member == null || newState.member.user.bot)
            return;
        const state = client.room.checkState(oldState, newState);
        if (state == room_1.MemberState.other)
            return;
        if (state == room_1.MemberState.joined) {
            console.log("new member joined");
            const server = yield client.database.getServer(newState.guild.id);
            if (server == null || server.eventChannel != newState.channelID)
                return;
            const channel = newState.guild.channels.cache.get(server.eventCategory);
            if (channel == undefined)
                return;
            const { voice, text } = yield client.room.create(newState.member.user, channel);
            yield newState.member.voice.setChannel(voice);
            const added = yield client.database.addOccasion(newState.guild.id, {
                voiceChannel: voice.id,
                textChannel: text.id,
                host: newState.member.id,
                state: room_2.OccasionState.waiting,
                server: server
            });
            if (!added)
                text.send("Database Error");
        }
        else {
            console.log("member left");
            const server = yield client.database.getServerRelations(oldState.guild.id);
            if (server == undefined)
                return;
            console.log(oldState.channelID);
            const occasion = server.events.find(event => event.voiceChannel == oldState.channelID);
            if (occasion == undefined)
                return;
            if (oldState.channel != null && oldState.channel.members.size == 0) {
                yield client.database.removeOccasion(oldState.guild.id, occasion.voiceChannel);
                yield client.room.delete(oldState.guild, occasion.voiceChannel, occasion.textChannel);
            }
        }
    })
};
