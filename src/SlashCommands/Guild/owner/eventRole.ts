import { setEventRole } from '../../../Commands/Setup';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'event_role',
    description: 'set up a role which will be mentioned in notifications.',
    options: [{name: 'role', type: "ROLE", description: "role to be mentioned", required: true}],
    run: async(client, interaction) => {
        try {
            await interaction.deferReply({ephemeral: true});
            if(!interaction.guild) throw new CommandError("You can use this command only in guild");
            const role = interaction.options.getRole("role", true);
            const response = await setEventRole(client, interaction.guild, interaction.user, role);
            await interaction.editReply({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                interaction.editReply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)]});
        }
    }
};