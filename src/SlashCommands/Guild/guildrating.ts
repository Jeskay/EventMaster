import {InteractCommand} from '../../Interfaces';
import { CommandError } from '../../Error';
import { guildRating } from '../../Commands/Guild';

export const command: InteractCommand = {
    name: 'guildrating',
    description: "shows guild members tier list",
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.channel) throw new CommandError("Channel not found");
            await guildRating(client, interaction.user, interaction);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 