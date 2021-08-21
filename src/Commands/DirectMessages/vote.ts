import { VoiceChannel} from 'discord.js';
import {Command} from '../../Interfaces';
import { CommandError } from '../../Error';
//
//  REAFCTOR THIS BULLSHIT 
//
export const command: Command = {
    name: 'vote',
    description: "vote for event host",
    aliases: ['v'],
    options: [{name: 'user', required: true}],
    run: async(client, message, args) => {
        const author = message.author;
        if(args.length != 1) return;
        let candidateID = args[0];
        if(message.guild)
            candidateID = client.helper.extractID(args[0]);
        try {
            if(author.id == candidateID) throw new CommandError("You can't vote for yourself.");
            const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidateID, channel)) as VoiceChannel;
            if(!voiceChannel) throw new CommandError("Both voter and candidate must be in occasion channel.");
            await client.occasionController.Vote(client, voiceChannel, author.id, candidateID);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 