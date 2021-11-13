import { like } from '../../../Commands/DirectMessages';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'like',
    description: "send a positive comment about user",
    options: [{name: 'user', type: "USER", description: "User to like", required: true}],
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser("user", true);
            if(!user) throw new CommandError("User does not exists.");
            const response = await like(client, interaction.user, user);
            await interaction.reply({embeds:[response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)]});
        }
    }
}; 