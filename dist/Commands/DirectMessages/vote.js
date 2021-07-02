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
exports.command = void 0;
exports.command = {
    name: 'vote',
    aliases: ['v'],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const author = message.author;
        if (args.length != 1)
            return;
        const candidateID = args[0];
        if (author.id == candidateID)
            return;
        const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidateID, channel));
        if (voiceChannel == undefined)
            return;
        try {
            const winner = yield client.vote.vote(voiceChannel.id, author.id, candidateID);
            if (winner != null) {
                client.vote.finish(voiceChannel.id);
                const server = yield client.database.getServerRelations(voiceChannel.guild.id);
                const occasion = server.events.find(event => event.voiceChannel == voiceChannel.id);
                if (!occasion)
                    return;
                const eventLeader = voiceChannel.members.get(winner);
                if (!eventLeader)
                    return;
                client.room.givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, eventLeader);
            }
        }
        catch (error) {
            message.channel.send(error);
        }
    })
};
