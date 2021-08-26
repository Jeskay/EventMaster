import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';
import {dislike} from '../../Commands/DirectMessages';

export const command:  TextCommand= {
    name: 'dislike',
    description: "Send a negative comment about user",
    options: [{name: "userId",  type: "USER"}],
    run: async(client, message, args) => {
        if(message.guild) return;
        if(args.length != 1) return;
        try {
            let userId = args[0];
            if(message.guild)
                userId = client.helper.extractID(args[0]);
            const user = await client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            const reponse = await dislike(client, message.author, user);
            await message.channel.send({embeds: [reponse]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 