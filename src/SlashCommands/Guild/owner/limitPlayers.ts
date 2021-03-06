import { setLimit } from '../../../Commands/Setup';
import { CommandError, handleCommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'limit_votes',
    description: 'set amount of votes to be achieved by user to finish the election',
    aliases: ['sl', 'limit'],
    options: [{name: 'amount', type: "INTEGER", description: "minimum amount of votes for host to start an occasion.", required: true}],
    run: async(client, interaction) => {
        try {
            const limit = interaction.options.getInteger("amount", true);
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            const response = await setLimit(client, interaction.guild, interaction.user, limit);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            handleCommandError(client,interaction, error);
        }
    }
};