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
    name: 'addowner',
    description: 'give user increased permissions for bot settings',
    aliases: ['setowner'],
    options: [{ name: 'user', required: true }],
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
            const settings = server.settings;
            if (message.author.id != guild.ownerId)
                throw new Error_1.CommandError("Permission denied.");
            const userId = client.helper.extractID(args[0]);
            const user = guild.members.cache.get(userId);
            if (!user)
                throw new Error_1.CommandError("Cannot find a user.");
            if (settings.owners.includes(userId))
                throw new Error_1.CommandError("This user already has owner permissions");
            settings.owners.push(userId);
            yield client.database.updateSettings(server.guild, {
                owners: settings.owners
            });
            yield message.channel.send({ embeds: [client.embeds.ownerAdded(user.displayName)] });
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
