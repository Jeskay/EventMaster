import { errorInformation } from '../../../Embeds';
import { profile } from '../../../Commands/DirectMessages';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    options: [{name: 'user', type: "USER", description: "user who's profile you want to see.", required: false}],
    run: async(client, interaction) => {
        try {
            const user = interaction.options.getUser('user') ?? interaction.user;
            const response = await profile(client, user);
            await interaction.reply(response);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [errorInformation(error.name, error.message, error.stack)]});
        }
    }
}; 