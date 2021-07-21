import { TextChannel, VoiceChannel } from 'discord.js';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg','finish'],
    options: [{name: 'result', required: true, description: 'Message that will be sent to log channel'}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            const server = await client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if(!occasion) throw Error("Only host has permission to finish an event");
            if(args.length < 1) throw Error("Event results must be provided. Ask moderation about respond format.");
            // Log ended event
            const voice = guild.channels.cache.get(occasion.voiceChannel);
            const text = guild.channels.cache.get(occasion.textChannel);
            if(!text) throw Error("Text channel has been removed, personal statistic will not be updated.");
            if(!voice) throw Error("Voice channel has been removed, personal statistic will not be updated.");
            console.log(`Voice channel is ${voice.name}`);
            await client.ratingController.updateMembers(client, voice as VoiceChannel);
            await client.database.removeOccasion(server.guild, occasion.voiceChannel);
            await (text as TextChannel).send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
            //logging 
            if(server.settings.logging_channel) {
                const channel = guild.channels.cache.get(server.settings.logging_channel);
                if(!channel || !channel.isText) return;
                (channel as TextChannel).send(client.embeds.occasionFinished(args.join(' '), message.author.username, voice.members.size));
            }
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};