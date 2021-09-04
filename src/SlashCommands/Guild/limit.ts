import { setLimit } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'setlimit',
    description: 'set amount of users to start the host election',
    aliases: ['sl', 'limit'],
    options: [{name: 'amount', type: "INTEGER", description: "minimum amount of votes for host to start an occasion.", required: true}],
    run: async(client, interaction) => {
        try {
            const limit = interaction.options.getInteger("amount", true);
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            const response = await setLimit(client, interaction.guild, interaction.user, limit);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};