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
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [{ name: 'title', type: "STRING" }, { name: 'description', type: "STRING" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length < 2)
                throw new Error_1.CommandError("Event name and description must be provided.");
            const title = args.shift();
            if (!title)
                throw new Error_1.CommandError("Event title can't be empty.");
            const description = args.join(' ');
            yield (0, Guild_1.announce)(client, message.author, guild, description, title);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
