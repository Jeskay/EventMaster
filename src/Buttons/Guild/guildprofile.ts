import { guildProfile } from '../../Commands/Guild';
import { CommandError, handleCommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'guildprofile',
    description: "",
    run: async(client, button, args) => {
        try {
            if(args.length != 1) throw new CommandError("Only one argument required.");
            if(!button.guild) throw new CommandError("Available only in guild.");
            const user = await button.guild.members.fetch(args[0]);
            const response = await guildProfile(client, user, button.guild);
            await button.update(response);
        } catch(error) {
            handleCommandError(client, button, error);
        }
    }
};