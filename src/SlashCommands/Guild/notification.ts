import { GuildChannel } from 'discord.js';
import { setNotification } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {InteractCommand} from '../../Interfaces';

export const command: InteractCommand = {
    name: 'notification',
    description: "set notification channel where bot will notify users about current events",
    aliases: ['notify'],
    options: [{name: 'channel', type: "CHANNEL", description: "Channel where bot will post announces about occasions.", required: true}],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in a guild.");
            const channel = interaction.options.getChannel("channel", true);
            const response = await setNotification(client, interaction.guild, interaction.user, channel as GuildChannel)
            await interaction.reply({content: response, ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};