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
        const winner = await client.vote.vote(voiceChannel.id, author.id, candidateID);
        console.log("vote performed");
        if(winner != null){
            client.vote.finish(voiceChannel.id);
            const server = await client.database.getServerRelations(voiceChannel.guild.id);
            if(server == undefined) return;
            console.log('server found');
            const occasion = server.events.find(event => event.voiceChannel == voiceChannel.id);
            if(occasion == undefined) return;
            console.log('occasion found');
            const eventLeader = voiceChannel.members.get(winner);
            if(eventLeader == undefined) return;
            console.log(`leader is ${eventLeader}`);
            client.room.givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, eventLeader);
        }
    }
}; 