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
    name: 'whitelist',
    description: 'removes a user from the black list',
    aliases: ['wl'],
    options: [{ name: 'user', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const guild = message.guild;
            if (!guild)
                return;
            if (args.length != 1)
                return;
            const user = client.helper.extractID(args[0]);
            const server = yield client.database.getServer(guild.id);
            if (!server)
                throw new Error_1.CommandError("Server is not registered yet.");
            if (!server.settings.owners.includes(message.author.id))
                throw new Error_1.CommandError("Permission denied.");
            const list = server.settings.black_list;
            list.splice(list.indexOf(user));
            yield client.database.updateSettings(guild.id, { black_list: list });
            yield message.channel.send({ embeds: [client.embeds.removedFromBlackList(args[0])] });
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
