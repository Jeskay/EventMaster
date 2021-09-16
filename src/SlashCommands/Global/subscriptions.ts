import {InteractCommand} from '../../Interfaces';
import { CommandError } from '../../Error';
import { subscriptions } from '../../Commands/DirectMessages';

export const command: InteractCommand = {
    name: 'subscribtions',
    description: "shows your subscription list",
    aliases: ['subs'],
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.channel) throw new CommandError("Channel not found");
            await subscriptions(client, interaction.user, interaction);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 