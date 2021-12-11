import { likeHost } from '../../Controllers';
import { CommandError, handleCommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';
import { hostCommended } from '../../Embeds';

export const button: Button = {
    name: 'likeHost',
    description: "",
    run: async(client, button, args) => {
        try {
            if(args.length != 1) throw new CommandError("Only one argument required.");
            const author = button.user.id;
            const host = args[0];
            await likeHost(client, host, author);
            await button.reply({embeds: [hostCommended()], ephemeral: true});
        } catch(error) {
            handleCommandError(client, button, error);
        }
    }
};