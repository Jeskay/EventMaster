import {TextCommand} from '../../Interfaces';
import {vote} from '../../Commands/DirectMessages';

export const command: TextCommand = {
    name: 'vote',
    description: "vote for event host",
    aliases: ['v'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        if(args.length != 1) return;
        let candidateID = args[0];
        if(message.guild)
            candidateID = client.helper.extractID(args[0]);
        const candidate = await client.users.fetch(candidateID);
        try {
            await vote(client, message.author, candidate);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 