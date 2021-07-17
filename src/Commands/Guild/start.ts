import { TextChannel, VoiceChannel } from 'discord.js';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'start',
    aliases: ['s'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            const server = await client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if(!occasion) throw Error("Only host has permission to start an event");
            if(args.length < 2) throw Error("Event name and description must be provided.");
            const title = args.shift();
            const description = args.join(' '); 
            if(!title) throw Error("Event name must be provided");
            await client.database.updateOccasion(guild.id, occasion.voiceChannel, {
                Title: title, 
                startedAt: new Date,
                description: description
            });
            await message.channel.send(client.embeds.startedOccasion);
            // Log started event
            if(server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if(!channel || !channel.isText) return;
                const voiceChannel = guild.channels.cache.get(occasion.voiceChannel) as VoiceChannel;
                if(!voiceChannel) throw Error("Cannot find voice channel");
                await (channel as TextChannel).send(client.embeds.occasionStarted(title, description, message.author.username, voiceChannel.members.size));
            }
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};