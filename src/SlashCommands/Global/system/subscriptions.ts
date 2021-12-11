import {InteractCommand} from '../../../Interfaces';
import { CommandError, handleCommandError } from '../../../Error';
import { subscriptions } from '../../../Commands/DirectMessages';

export const command: InteractCommand = {
    name: 'subscriptions',
    description: "shows your subscription list",
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.channel) throw new CommandError("Channel not found");
            await subscriptions(client, interaction.user, interaction);
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 