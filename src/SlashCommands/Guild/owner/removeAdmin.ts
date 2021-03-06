import { CommandError, handleCommandError } from '../../../Error';
import { removeOwner } from '../../../Commands/Setup';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'remove_admin',
    description: 'deny user permissions to edit blacklist',
    aliases: ['deleteowner'],
    options: [{name: 'user', type: "USER", description: "Owner who will lose his permissions.", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in a guild.");
            const user = interaction.options.getUser("user", true);
            const response = await removeOwner(client, interaction.guild, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
};