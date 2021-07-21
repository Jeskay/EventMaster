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
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [{ name: 'title', required: true }, { name: 'description', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (!guild)
            return;
        try {
            const server = yield client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if (!occasion)
                throw Error("Only host has permission to start an event.");
            if (args.length < 2)
                throw Error("Event name and description must be provided.");
            const title = args.shift();
            if (!title)
                throw Error("Event title can't be empty.");
            const description = args.join(' ');
            if (!server.settings.notification_channel)
                throw Error("Notification channel was not set up.");
            const channel = guild.channels.cache.get(server.settings.notification_channel);
            if (!channel || !channel.isText)
                throw Error("Cannot find notification channel.");
            yield channel.send(client.embeds.occasionNotification(title, description, message.author.username));
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
