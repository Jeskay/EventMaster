import {InteractCommand} from '../../../Interfaces';
import { vote } from '../../../Commands/DirectMessages';
import { handleCommandError } from '../../../Error';

export const command: InteractCommand = {
    name: 'voteid',
    description: "vote for event host",
    options: [{name: 'userid', type: "STRING", description: "Id of user you want to become a host.", required: true}],
    run: async(client, interaction) => {
        try {
            const candidateID = interaction.options.getString("userid", true);
            const candidate = await client.users.fetch(candidateID);
            const response = await vote(client, interaction.user, candidate);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 