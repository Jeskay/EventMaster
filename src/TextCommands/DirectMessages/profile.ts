import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';
import {profile} from '../../Commands/DirectMessages';

export const command: TextCommand = {
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            if(args.length > 1) return;
            let userId = args[0];
            if(args.length == 0) userId = message.author.id;
            else if(message.guild)
                userId = client.helper.extractID(args[0]);
            const user = await client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            const response = await profile(client, user);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 