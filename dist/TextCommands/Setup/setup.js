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
const Setup_1 = require("../../Commands/Setup/");
exports.command = {
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [{ name: 'channel', type: "CHANNEL" }, { name: 'category', type: "CHANNEL" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length != 2)
                throw new Error_1.CommandError("Invalid number of arguments.");
            const { voice, category } = yield client.helper.getRelatedChannels(args[0], args[1], guild);
            const response = yield Setup_1.setOccasions(client, guild, message.author, voice, category);
            yield message.channel.send(response);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
