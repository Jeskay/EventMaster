import { CommandError } from '../../../Error';
import {InteractCommand} from '../../../Interfaces';
import {setOccasions} from '../../../Commands/Setup';
import { CategoryChannel, GuildChannel, VoiceChannel } from 'discord.js';

export const command: InteractCommand = {
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [
        {name: 'channel', type: "CHANNEL", required: true, description: "Voice channel where to join to create an occasion."}, 
        {name: 'category', type: "CHANNEL", required: true, description: "Category where voice and text channels for new occasion will be created."}
    ],
    run: async(client, interaction) => {
        try {
            if(!interaction.guild) throw new CommandError("Available only in a guild.");
            const voice = interaction.options.getChannel('channel', true) as GuildChannel;
            const category = interaction.options.getChannel('category', true) as GuildChannel;
            if(!(voice instanceof VoiceChannel && category instanceof CategoryChannel)) throw new CommandError("Invalid channel type.");
            const response = await setOccasions(client, interaction.guild, interaction.user, voice as VoiceChannel, category as CategoryChannel);
            await interaction.reply({embeds: [response], ephemeral: true});
        } catch(error) {
            if(error instanceof Error)
                interaction.reply({embeds: [client.embeds.errorInformation(error.name, error.message, error.stack)], ephemeral: true});
        }
    }
};