import { profile } from '../../Commands/DirectMessages';
import { CommandError } from '../../Error';
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
            if(error instanceof Error)
                button.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};