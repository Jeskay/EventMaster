import {InteractCommand} from '../../../Interfaces';
import {dislike} from '../../../Commands/DirectMessages';

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
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
}; 