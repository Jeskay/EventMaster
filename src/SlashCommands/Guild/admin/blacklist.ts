import { CommandError } from '../../../Error';
import { blackList } from '../../../Commands/Guild';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'blacklist',
    description: 'Shows all users blocked on this server',
    options: [],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            await blackList(client, interaction, interaction.user, interaction.guild);
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};