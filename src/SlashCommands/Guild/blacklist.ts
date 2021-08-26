import { CommandError } from '../../Error';
import { addToBlackList } from '../../Commands/Setup';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'blacklist',
    description: 'add user to black list, so he cannot became host on this server',
    aliases: ['bl'],
    options: [{name: 'user', type: "USER", description: "User to add in blacklist.", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            const user = interaction.options.getUser("user", true);
            const response = await addToBlackList(client, interaction.guild, interaction.user, user); 
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};