import { GuildChannel } from 'discord.js';
import { setLog } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'logging',
    description: "set log channel where bot will post information about passed events",
    aliases: ['log'],
    options: [{name: 'channel', type: "CHANNEL"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("Channel id must be provided.");
            const channel = await guild.channels.fetch(args[0]);
            if(!channel) throw new CommandError("Invalid channel id.");
            const response = await setLog(client, guild, message.author, channel as GuildChannel);
            await message.channel.send(response);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};