import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';
import {like} from '../../Commands/DirectMessages';
import { extractID } from '../../Utils';

export const command: TextCommand = {
    name: 'like',
    description: "send a positive comment about user",
    options: [{name: 'userId', type: 'USER'}],
    run: async(client, message, args) => {
        try {
            if(args.length != 1) return;
            let userId = args[0];
            if(message.guild)
                userId = extractID(args[0]);
            const user = client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            const response = await like(client, message.author, user);
            await message.channel.send({embeds:[response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 