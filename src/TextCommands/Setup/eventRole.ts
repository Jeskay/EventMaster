import { TextCommand } from '../../Interfaces';
import { setEventRole } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import { extractID } from '../../Utils';

export const command: TextCommand = {
    name: 'event_role',
    description: 'set up a role which will be mentioned in notifications.',
    options: [{name: 'role', type: "ROLE"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const roleId = extractID(args[0]);
            const role = await guild.roles.fetch(roleId);
            if(!role) throw new CommandError("Invalid role id.")
            const response = await setEventRole(client, guild, message.author, role);
            await message.reply({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)]});
        }
    }
};