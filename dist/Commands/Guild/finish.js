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
    name: 'finishgame',
    aliases: ['fg', 'finish'],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (guild == null)
            return;
        try {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if (!occasion)
                throw Error("Only host has permission to finish an event");
            if (args.length < 1)
                throw Error("Event results must be provided. Ask moderation about respond format.");
            const voice = guild.channels.cache.get(occasion.voiceChannel);
            if (!voice)
                throw Error("Voice channel has been removed, personal statistic will not be updated.");
            console.log(`Voice channel is ${voice.name}`);
            yield client.ratingController.updateMembers(client, voice);
            yield client.database.removeOccasion(server.guild, occasion.voiceChannel);
            yield message.channel.send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
        }
        catch (error) {
            yield message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
