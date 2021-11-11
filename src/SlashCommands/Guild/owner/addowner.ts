import { addOwner } from '../../../Commands/Setup';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'addowner',
    description: 'Gives user extended permissions for bot settings',
    aliases: ['setowner'],
    options: [{name: 'user', type: "USER", description: "A user to give extended permissions.", required: true}],
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser("user", true);
            if(!interaction.guild) throw new CommandError("Avaliable only in guild.");
            const response = await addOwner(client, interaction.guild, interaction.user, user);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
};