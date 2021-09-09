import { announce } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [
        {name: 'title', type: "STRING", description: "announcement title", required: true}, 
        {name: 'description', type: "STRING", description: "brief information about occasion", required: true},
        {name: 'image', type: "STRING", description: "Image url which will be added to announce message", required: false}
    ],
    run: async(client, interaction) => {
        try {
            await interaction.deferReply({ephemeral: true});
            if(!interaction.guild) throw new CommandError("You can use this command only in guild");
            const title = interaction.options.getString("title", true);
            const description = interaction.options.getString("description", true);
            const image = interaction.options.getString("image") ?? undefined;
            const response = await announce(client, interaction.user, interaction.guild, description, title, image);
            await interaction.editReply({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                interaction.editReply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};