import {ContextCommand, ContextType} from '../Interfaces';
import {vote} from '../Commands/DirectMessages';
import { CommandError, handleCommandError } from '../Error';

export const command: ContextCommand = {
    name: 'vote_menu',
    type: ContextType.USER,
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser('user');
            if(!user) throw new CommandError("Unable to find a user.");
            const response = await vote(client, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 