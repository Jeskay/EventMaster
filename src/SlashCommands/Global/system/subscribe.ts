import { subscribe } from '../../../Commands/DirectMessages';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'subscribe',
    description: "subscribe for personal events notifications",
    options: [{name: 'title', type: "STRING", description: "Title to subscribe for.", required: true}],
    run: async(client, interaction) => {
        try {
            const title = interaction.options.getString('title', true);
            const response = await subscribe(client, interaction.user, title);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 