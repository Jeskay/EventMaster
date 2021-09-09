import { finish } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg','finish'],
    options: [{name: 'result', type: "STRING", description: "Results for logs", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("This is allowed only in guild channel");
            const result = interaction.options.getString("result", true);
            const response = await finish(client, interaction.user, interaction.guild, result);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};