import { TextChannel } from 'discord.js';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [{name: 'title', required: true}, {name: 'description', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            const server = await client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if(!occasion) throw Error("Only host has permission to start an event.");
            if(args.length < 2) throw Error("Event name and description must be provided.");
            const title = args.shift();
            if(!title) throw Error("Event title can't be empty.");
            const description = args.join(' ');
            if(!server.settings.notification_channel) throw Error("Notification channel was not set up.");
            const channel = guild.channels.cache.get(server.settings.notification_channel);
            if(!channel || !channel.isText) throw Error("Cannot find notification channel.");
            await (channel as TextChannel).send(client.embeds.occasionNotification(title, description, message.author.username));
            
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};