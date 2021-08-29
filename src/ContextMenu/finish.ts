import { finish } from '../Commands/Guild';
import { CommandError } from '../Error';
import {ContextCommand, ContextType} from '../Interfaces';

export const command: ContextCommand = {
    name: 'finish message',
    type: ContextType.MESSAGE,
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("This is allowed only in guild channel");
            const result = interaction.options.getMessage("message");
            if(!result) throw new CommandError("Unable to find a message.");
            await finish(client, interaction.user, interaction.guild, result.content);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};