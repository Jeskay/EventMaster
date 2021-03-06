import { unsubscribe } from '../../../Commands/DirectMessages';
import {InteractCommand} from '../../../Interfaces';
import { handleCommandError } from '../../../Error';


export const command: InteractCommand = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    options: [{name: 'title', type: "STRING", description: "Title which you don't want to be notified about.", required: true}],
    run: async(client, interaction) => {
        try {
            const title = interaction.options.getString('title', true);
            const response = await unsubscribe(client, interaction.user, title);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 