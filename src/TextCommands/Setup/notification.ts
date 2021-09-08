import { GuildChannel } from 'discord.js';
import { setNotification } from '../../Commands/Setup';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'notification',
    description: "set notification channel where bot will notify users about current events",
    aliases: ['notify'],
    options: [{name: 'channel', type: "CHANNEL"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) throw new CommandError("Channel id must be provided.");
            const channel = await guild.channels.fetch(args[0]);
            if(!channel) throw new CommandError("Invalid channel id.");
            const response = await setNotification(client, guild, message.author, channel as GuildChannel)
            await message.channel.send(response);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};