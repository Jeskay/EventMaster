import { unsubscribe } from '../../Commands/DirectMessages';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    aliases: ['unsub'],
    options: [{name: 'title', type: "STRING", description: "Title which you don't want to be notified about.", required: true}],
    run: async(client, interaction) => {
        try {
            const title = interaction.options.getString('title', true);
            await unsubscribe(client, interaction.user, title);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 