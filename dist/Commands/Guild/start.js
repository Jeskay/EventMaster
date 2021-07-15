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
    aliases: ['s'],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (guild == null)
            return;
        try {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if (!occasion)
                throw Error("Only host has permission to start an event");
            if (args.length < 2)
                throw Error("Event name and description must be provided.");
            const title = args.shift();
            if (!title)
                throw Error("Event name must be provided");
            yield client.database.updateOccasion(guild.id, occasion.voiceChannel, {
                Title: title,
                startedAt: new Date,
                description: args.join(' ')
            });
            yield message.channel.send(client.embeds.startedOccasion);
        }
        catch (error) {
            yield message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
