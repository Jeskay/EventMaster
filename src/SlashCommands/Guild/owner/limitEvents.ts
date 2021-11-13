import { setOccasionLimit } from '../../../Commands/Setup';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';

export const command: InteractCommand = {
    name: 'limit_events',
    description: 'set maximum amount of events at the same time',
    options: [{name: 'amount', type: "INTEGER", description: "maximum amount of occasions which can exist at the same moment.", required: true}],
    run: async(client, interaction) => {
        try {
            const limit = interaction.options.getInteger("amount", true);
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            const response = await setOccasionLimit(client, interaction.guild, interaction.user, limit);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
};