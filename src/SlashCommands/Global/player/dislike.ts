import {InteractCommand} from '../../../Interfaces';
import {dislike} from '../../../Commands/DirectMessages';
import { handleCommandError } from '../../../Error';

export const command: InteractCommand = {
    name: 'dislike',
    description: "Send a negative comment about user",
    options: [{name: "user", type: "USER", description: "user to dislike", required: true}],
    run: async(client, interaction) => {
        if(interaction.guild) return;
        try {
            const user = interaction.options.getUser('user', true);
            const response = await dislike(client, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 