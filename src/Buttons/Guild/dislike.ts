import { CommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'dislikeHost',
    description: "",
    run: async(client, component, args) => {
        try {
            if(args.length != 1) throw new CommandError("Too much arguments");
            const author = component.user.id;
            const host = args[0];
            await client.ratingController.dislikeHost(client, host, author);
            await component.reply({embeds: [client.embeds.hostCommended()], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                component.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};