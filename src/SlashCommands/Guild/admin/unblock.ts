import { removeFromBlackList } from '../../../Commands/Setup';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'unblock',
    description: 'removes a user from the black list',
    aliases: ['unbl'],
    options: [{name: 'user', type: "USER", required: true, description: "User to remove from black list."}],
    run: async(client,interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in a guild.");
            const user = interaction.options.getUser("user", true);
            const response = await removeFromBlackList(client, interaction.guild, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
};