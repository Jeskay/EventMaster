import { addToBlackList } from '../../Commands/Setup';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'blacklist',
    description: 'add user to black list, so he cannot became host on this server',
    aliases: ['bl'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const userId = client.helper.extractID(args[0]);
            const user = await client.users.fetch(userId)
            const response = await addToBlackList(client, guild, message.author, user) 
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};