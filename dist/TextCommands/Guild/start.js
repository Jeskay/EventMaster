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
const Guild_1 = require("../../Commands/Guild");
const Error_1 = require("../../Error");
exports.command = {
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [{ name: 'title', type: "STRING" }, { name: 'description', type: "STRING" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length < 2)
                throw new Error_1.CommandError("Event name and description must be provided.");
            const title = args.shift();
            const description = args.join(' ');
            yield Guild_1.start(client, message.author, guild, title, description);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
        ;
    })
};
