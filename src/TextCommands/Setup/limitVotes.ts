import { setLimit } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'limit_votes',
    description: 'set amount of votes to be achieved by user to finish the election.',
    aliases: ['setlimit', 'limit'],
    options: [{name: 'amount', type: "NUMBER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("Users amount must be provided.");
            const limit = parseInt(args[0]);
            await setLimit(client, guild, message.author, limit);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};