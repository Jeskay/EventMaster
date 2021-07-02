import { VoiceChannel} from 'discord.js';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'vote',
    aliases: ['v'],
    run: async(client, message, args) => {
        const author = message.author;
        if(args.length != 1) return;
        const candidateID = args[0];
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
            }
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 