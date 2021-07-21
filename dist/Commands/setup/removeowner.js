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
    name: 'removeowner',
    description: 'deny user permissions for bot settings',
    aliases: ['deleteowner'],
    options: [{ name: 'user', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (!guild)
            return;
        if (args.length != 1)
            return;
        try {
            const server = yield client.database.getServer(guild.id);
            if (!server)
                throw Error("Server is not registered yet.");
            const settings = server.settings;
            if (message.author.id != guild.ownerID)
                throw Error("Permission denied.");
            const userId = client.helper.extractID(args[0]);
            const user = guild.members.cache.get(userId);
            if (!user)
                throw Error("Cannot find a user.");
            if (!settings.owners.includes(userId))
                throw Error("This user does not have owner permissions");
            settings.owners.filter(id => id != userId);
            yield client.database.updateSettings(server.guild, {
                owners: settings.owners
            });
            yield message.channel.send(client.embeds.ownerRemoved(user.displayName));
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
