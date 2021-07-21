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
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [{ name: 'title', required: true }, { name: 'description', required: true, description: 'message that will be sent to log channel' }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (!guild)
            return;
        try {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if (!occasion)
                throw Error("Only host has permission to start an event");
            if (args.length < 2)
                throw Error("Event name and description must be provided.");
            const title = args.shift();
            const description = args.join(' ');
            if (!title)
                throw Error("Event name must be provided");
            yield client.database.updateOccasion(guild.id, occasion.voiceChannel, {
                Title: title,
                startedAt: new Date,
                description: description
            });
            yield message.channel.send(client.embeds.startedOccasion);
            if (server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if (!channel || !channel.isText)
                    return;
                const voiceChannel = guild.channels.cache.get(occasion.voiceChannel);
                if (!voiceChannel)
                    throw Error("Cannot find voice channel");
                yield channel.send(client.embeds.occasionStarted(title, description, message.author.username, voiceChannel.members.size));
            }
        }
        catch (error) {
            yield message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
