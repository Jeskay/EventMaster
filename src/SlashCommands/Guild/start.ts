import { start } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [
        {name: 'title', type: "STRING", description: "occasion title", required: true}, 
        {name: 'description', type: "STRING", description: "brief information about occasion", required: true}
    ],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("This is allowed only in guild channel.");
            const title = interaction.options.getString("title", true);
            const description = interaction.options.getString("description", true);
            const response = await start(client, interaction.user, interaction.guild, title, description);
            await interaction.reply({embeds: [response], ephemeral: true});
        }
        catch(error){
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        };
    }
};