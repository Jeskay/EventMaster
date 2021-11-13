import { dislikeHost } from '../../Controllers';
import { CommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'dislikeHost',
    description: "",
    run: async(client, button, args) => {
        try {
            if(args.length != 1) throw new CommandError("Too much arguments");
            const author = button.user.id;
            const host = args[0];
            await dislikeHost(client, host, author);
            await button.reply({embeds: [client.embeds.hostCommended()], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                button.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};