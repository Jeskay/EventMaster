import { profile } from '../../Commands/DirectMessages';
import { CommandError, handleCommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'globalprofile',
    description: "",
    run: async(client, button, args) => {
        try {
            if(args.length != 1) throw new CommandError("Only one argument required.");
            const user = await client.users.fetch(args[0]);
            const response = await profile(client, user, button.guild ?? undefined);
            await button.update(response);
        } catch(error) {
            handleCommandError(client, button, error);
        }
    }
};