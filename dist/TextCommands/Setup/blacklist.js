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
const Utils_1 = require("../../Utils");
exports.command = {
    name: 'blacklist',
    description: 'add user to black list, so he cannot became host on this server',
    aliases: ['bl'],
    options: [{ name: 'user', type: "USER" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length != 1)
                return;
            const userId = (0, Utils_1.extractID)(args[0]);
            const user = yield client.users.fetch(userId);
            const response = yield (0, Setup_1.addToBlackList)(client, guild, message.author, user);
            yield message.channel.send({ embeds: [response] });
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
