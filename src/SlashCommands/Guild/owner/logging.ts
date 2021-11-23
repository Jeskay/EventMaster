import { GuildChannel } from 'discord.js';
import { setLog } from '../../../Commands/Setup';
import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';
import { errorInformation } from '../../../Embeds';

export const command: InteractCommand = {
    name: 'logging',
    description: "set log channel where bot will post information about passed events",
    aliases: ['log'],
    options: [{name: 'channel', type: "CHANNEL", description: "Channel to send occasion logs.", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Avaliable only in a guild.");
            const channel = interaction.options.getChannel("channel", true);
            const response = await setLog(client, interaction.guild, interaction.user, channel as GuildChannel);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
};