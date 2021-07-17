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
        if (!guild)
            return;
        try {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if (!occasion)
                throw Error("Only host has permission to finish an event");
            if (args.length < 1)
                throw Error("Event results must be provided. Ask moderation about respond format.");
            const voice = guild.channels.cache.get(occasion.voiceChannel);
            const text = guild.channels.cache.get(occasion.textChannel);
            if (!text)
                throw Error("Text channel has been removed, personal statistic will not be updated.");
            if (!voice)
                throw Error("Voice channel has been removed, personal statistic will not be updated.");
            console.log(`Voice channel is ${voice.name}`);
            yield client.ratingController.updateMembers(client, voice);
            yield client.database.removeOccasion(server.guild, occasion.voiceChannel);
            yield text.send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
            if (server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if (!channel || !channel.isText)
                    return;
                channel.send(client.embeds.occasionFinished(args.join(' '), message.author.username, voice.members.size));
            }
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
