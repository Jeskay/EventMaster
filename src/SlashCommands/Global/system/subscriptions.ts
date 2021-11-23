import {InteractCommand} from '../../../Interfaces';
import { CommandError } from '../../../Error';
import { subscriptions } from '../../../Commands/DirectMessages';
import { errorInformation } from '../../../Embeds';

export const command: InteractCommand = {
    name: 'subscriptions',
    description: "shows your subscription list",
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.channel) throw new CommandError("Channel not found");
            await subscriptions(client, interaction.user, interaction);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [errorInformation(error.name, error.message, error.stack)]});
        }
    }
}; 