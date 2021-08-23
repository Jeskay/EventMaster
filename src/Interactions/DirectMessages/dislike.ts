import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'dislike',
    description: "Send a negative comment about user",
    options: [{name: "user", type: "USER"}],
    run: async(client, interaction) => {
        if(interaction.guild) return;
        try {
            const userId = interaction.options.get('user', true).value;
            if(typeof(userId) != 'string') throw new CommandError("Incorrect Option format.");
            const user = await client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            //
            // Deprecated 
            //(use reply from command instead)
            await client.ratingController.DislikePlayer(client, user.id, interaction.user.id);
            await interaction.reply({embeds: [client.embeds.playerCommended(user)], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
}; 