import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'logging',
    description: "set log channel where bot will post information about passed events",
    aliases: ['log'],
    options: [{name: 'channel', required: true}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const server = await client.database.getServer(guild.id);
            if(!server) throw new CommandError("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw new CommandError("Permission denied.");
            const channel = guild.channels.cache.get(args[0]);
            if(!channel) throw new CommandError("Invalid channel id");
            if(channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') throw new CommandError("Only text or news channel allowed");
            await client.database.updateSettings(guild.id, {logging_channel: channel.id});
            await message.channel.send(`Channel ${channel.name} successfuly set for logging.`);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};