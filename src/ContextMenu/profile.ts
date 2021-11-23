import { CommandError } from '../Error';
import { profile } from '../Commands/DirectMessages';
import {ContextCommand, ContextType} from '../Interfaces';
import { errorInformation } from '../Embeds';

export const command: ContextCommand = {
    name: 'profile_menu',
    type: ContextType.USER,
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser('user');
            if(!user) throw new CommandError('Unable to find user.');
            const response = await profile(client, user);
            await interaction.reply(response);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
}; 