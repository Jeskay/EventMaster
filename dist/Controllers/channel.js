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
exports.ChannelController = void 0;
const room_1 = require("../Managers/room");
class ChannelController {
    createChannelJoined(member, server, database, room) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = member.guild.channels.cache.get(server.eventCategory);
            if (channel == undefined)
                return;
            const { voice, text } = yield room.create(member.user, channel);
            yield member.voice.setChannel(voice);
            const added = yield database.addOccasion(member.guild.id, {
                voiceChannel: voice.id,
                textChannel: text.id,
                host: member.id,
                state: room_1.OccasionState.waiting,
                server: server
            });
            if (!added)
                text.send("Database Error");
        });
    }
    joinHandler(client, member, joinedChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield client.database.getServerRelations(member.guild.id);
            if (server == null)
                return;
            if (server.eventChannel == joinedChannel.id) {
                yield this.createChannelJoined(member, server, client.database, client.room);
                return;
            }
            const occasion = server.events.find(event => event.voiceChannel == joinedChannel.id);
            if (occasion == undefined)
                return;
            if (joinedChannel.members.size >= server.settings.limit) {
                const text = joinedChannel.guild.channels.cache.get(occasion.textChannel);
                if (text == undefined || !text.isText)
                    return;
                client.vote.start(occasion.voiceChannel, 1);
                text.send("The election for the event master has started!");
            }
            console.log("new member joined event");
        });
    }
}
exports.ChannelController = ChannelController;
