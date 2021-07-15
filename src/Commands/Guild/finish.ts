import { VoiceChannel } from 'discord.js';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'finishgame',
    aliases: ['fg','finish'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(guild == null) return;
        try {
            const server = await client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if(!occasion) throw Error("Only host has permission to finish an event");
            if(args.length < 1) throw Error("Event results must be provided. Ask moderation about respond format.");
            // Log ended event
            const voice = guild.channels.cache.get(occasion.voiceChannel);
            if(!voice) throw Error("Voice channel has been removed, personal statistic will not be updated.");
            console.log(`Voice channel is ${voice.name}`);
            await client.ratingController.updateMembers(client, voice as VoiceChannel);
            await client.database.removeOccasion(server.guild, occasion.voiceChannel);
            await message.channel.send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
            setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};