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
const Setup_1 = require("../../Commands/Setup");
const Error_1 = require("../../Error");
exports.command = {
    name: 'notification',
    description: "set notification channel where bot will notify users about current events",
    aliases: ['notify'],
    options: [{ name: 'channel', type: "CHANNEL" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length != 1)
                throw new Error_1.CommandError("Channel id must be provided.");
            const channel = yield guild.channels.fetch(args[0]);
            if (!channel)
                throw new Error_1.CommandError("Invalid channel id.");
            const response = yield (0, Setup_1.setNotification)(client, guild, message.author, channel);
            yield message.channel.send({ embeds: [response] });
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
