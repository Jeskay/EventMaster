import { extractID } from '../../Utils';
import { removeFromBlackList } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'unblock_user',
    description: 'removes a user from the black list',
    aliases: ['unblock'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("User Id must be provided");
            const userId = extractID(args[0]);
            const user = await client.users.fetch(userId);
            const response = await removeFromBlackList(client, guild, message.author, user);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};