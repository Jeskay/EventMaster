import { addOwner } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';
import { extractID } from '../../Utils';

export const command: TextCommand = {
    name: 'set_admin',
    description: 'give user increased permissions for bot settings',
    aliases: ['setowner'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const userId = extractID(args[0]);
            const user = await client.users.fetch(userId);
            if(!user) throw new CommandError("Cannot find a user.");
            const response = await addOwner(client, guild, message.author, user);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};