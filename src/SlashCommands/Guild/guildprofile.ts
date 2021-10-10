import { CommandError } from '../../Error';
import { guildProfile } from '../../Commands/Guild';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'guildprofile',
    description: "print guild member statistics",
    aliases: ['guildinfo'],
    options: [{name: 'user', type: "USER", description: "user who's profile you want to see.", required: false}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in guild");
            const user = interaction.options.getUser('user') ?? interaction.user;
            const response = await guildProfile(client, user, interaction.guild);
            await interaction.reply(response);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 