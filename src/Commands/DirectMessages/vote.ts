import { VoiceChannel} from 'discord.js';
import { OccasionState } from '../../Managers/room';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'vote',
    aliases: ['v'],
    run: async(client, message, args) => {
        const author = message.author;
        if(args.length != 1) return;
        const candidateID = client.helper.extractID(args[0]);
        if(author.id == candidateID) return;
        /*Discord bug with one member in several guilds should be processed */
        const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidateID, channel)) as VoiceChannel;
        if(voiceChannel == undefined) return;
        try {   
            const winner = await client.vote.vote(voiceChannel.id, author.id, candidateID);
            if(winner != null){
                client.vote.finish(voiceChannel.id);
                const server = await client.database.getServerRelations(voiceChannel.guild.id);
                const occasion = server.events.find(event => event.voiceChannel == voiceChannel.id);
                if(!occasion) return;
                const eventLeader = voiceChannel.members.get(winner);
                if(!eventLeader) return;
                client.room.givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, eventLeader);
                await client.database.updateOccasion(voiceChannel.guild.id, voiceChannel.id, {
                    state: OccasionState.playing,
                    host: eventLeader.id
                });
                await message.channel.send(client.embeds.electionFinished(eventLeader.user.username));
            } else await message.channel.send(client.embeds.voteConfimation(args[0]));
        } catch(error) {
            await message.channel.send(error);
        }
    }
}; 