import { removeOwner } from '../../Commands/Setup';
import {TextCommand} from '../../Interfaces';
import { extractID } from '../../Utils';

export const command: TextCommand = {
    name: 'removeowner',
    description: 'deny user permissions for bot settings',
    aliases: ['deleteowner'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const userId = extractID(args[0]);
            const user = await client.users.fetch(userId);
            const response = await removeOwner(client, guild, message.author, user);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};