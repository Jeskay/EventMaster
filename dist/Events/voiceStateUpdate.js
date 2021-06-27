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
exports.event = {
    name: 'voiceStateUpdate',
    run: (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
        if (newState.member == null || newState.member.user.bot)
            return;
        const state = client.room.checkState(oldState, newState);
        if (state == room_1.MemberState.other)
            return;
        if (state == room_1.MemberState.joined) {
            yield client.channelController.joinHandler(client, newState.member, newState.channel);
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
