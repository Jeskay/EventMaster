import {InteractCommand} from '../../../Interfaces';
import { vote } from '../../../Commands/DirectMessages';
import { handleCommandError } from '../../../Error';

export const command: InteractCommand = {
    name: 'vote',
    description: "vote for event host",
    options: [{name: 'user', type: "USER", description: "User you want to be a host.", required: true}],
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser("user", true);
            const response = await vote(client, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 