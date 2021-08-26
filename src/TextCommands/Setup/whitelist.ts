import { removeFromBlackList } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'whitelist',
    description: 'removes a user from the black list',
    aliases: ['wl'],
    options: [{name: 'user', type: "USER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("User Id must be provided");
            const userId = client.helper.extractID(args[0]);
            const user = await client.users.fetch(userId);
            const response = await removeFromBlackList(client, guild, message.author, user);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};