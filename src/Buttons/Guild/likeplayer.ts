import { likePlayer } from '../../Controllers';
import { CommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';
import { errorInformation, hostCommended } from '../../Embeds';

export const button: Button = {
    name: 'likePlayer',
    description: "",
    run: async(client, button, args) => {
        try {
            if(args.length != 1) throw new CommandError("Only one argument required.");
            const author = button.user.id;
            const player = args[0];
            await likePlayer(client, player, author);
            await button.reply({embeds: [hostCommended()], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                button.reply({embeds: [errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};