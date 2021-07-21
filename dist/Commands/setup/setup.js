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
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [{ name: 'channel', required: true }, { name: 'category', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (!guild)
            return;
        if (args.length != 2)
            return;
        const channel = args[0];
        const category = args[1];
        try {
            const server = yield client.database.getServer(guild.id);
            if (!server)
                throw Error("Server is not registered yet.");
            if (!server.settings.owners.includes(message.author.id))
                throw Error("Permission denied.");
            client.helper.validatePair(channel, category, guild);
            yield client.database.updateServer(guild.id, {
                eventChannel: channel,
                eventCategory: category
            });
            yield message.channel.send("channel and category successfuly binded.");
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
