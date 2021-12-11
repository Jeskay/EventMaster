import { CommandError, handleCommandError } from '../Error';
import { profile } from '../Commands/DirectMessages';
import {ContextCommand, ContextType} from '../Interfaces';

export const command: ContextCommand = {
    name: 'profile_menu',
    type: ContextType.USER,
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser('user');
            console.log(CommandError);
            if(!user) throw new CommandError('Unable to find user.');
            const response = await profile(client, user);
            await interaction.reply(response);
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 