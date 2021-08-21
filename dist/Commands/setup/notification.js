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
const Error_1 = require("../../Error");
exports.command = {
    name: 'notification',
    description: "set notification channel where bot will notify users about current events",
    aliases: ['notify'],
    options: [{ name: 'channel', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length != 1)
                return;
            const server = yield client.database.getServer(guild.id);
            if (!server)
                throw new Error_1.CommandError("Server is not registered yet.");
            if (!server.settings.owners.includes(message.author.id))
                throw new Error_1.CommandError("Permission denied.");
            const channel = guild.channels.cache.get(args[0]);
            if (!channel)
                throw new Error_1.CommandError("Invalid channel id");
            if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS')
                throw new Error_1.CommandError("Only text or news channel allowed");
            yield client.database.updateSettings(guild.id, { notification_channel: channel.id });
            yield message.channel.send(`Channel ${channel.name} successfuly set to notification.`);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
