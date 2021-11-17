import { setOccasionLimit } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import { TextCommand } from '../../Interfaces';

export const command: TextCommand = {
    name: 'limit_events',
    description: 'set maximum amount of events at the same time',
    options: [{name: 'amount', type: "NUMBER"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("Users amount must be provided.");
            const limit = parseInt(args[0]);
            const response = await setOccasionLimit(client, guild, message.author, limit);
            await message.reply({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)]});
        }
    }
};