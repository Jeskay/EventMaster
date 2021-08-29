import { announce } from '../Commands/Guild';
import { CommandError } from '../Error';
import {ContextCommand, ContextType} from '../Interfaces';

export const command: ContextCommand = {
    name: 'announce',
    type: ContextType.MESSAGE,
    run: async(client, interaction) => {
        try {
            await interaction.deferReply({ephemeral: true});
            if(!interaction.guild) throw new CommandError("You can use this command only in guild");
            const description = interaction.options.getMessage('message');
            if(!description) throw new CommandError("Message can't be empty.");
            await announce(client, interaction.user, interaction.guild, description.content);
            await interaction.editReply("Announce published successfuly.");
        } catch(error) {
            if(error instanceof Error)
                interaction.editReply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};