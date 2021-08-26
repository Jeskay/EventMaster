import { CommandError } from '../../Error';
import { removeOwner } from '../../Commands/Setup';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'removeowner',
    description: 'deny user permissions for bot settings',
    aliases: ['deleteowner'],
    options: [{name: 'user', type: "USER", description: "Owner who will lose his permissions.", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in a guild.");
            const user = interaction.options.getUser("user", true);
            const response = await removeOwner(client, interaction.guild, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};