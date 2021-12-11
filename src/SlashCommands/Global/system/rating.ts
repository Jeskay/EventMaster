import {InteractCommand} from '../../../Interfaces';
import { CommandError, handleCommandError } from '../../../Error';
import { playerRating } from '../../../Commands/DirectMessages';

export const command: InteractCommand = {
    name: 'rating',
    description: "shows player tier list",
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.channel) throw new CommandError("Channel not found");
            await playerRating(client, interaction.user, interaction);
        } catch(error) {
            handleCommandError(client, interaction, error);
        }
    }
}; 