import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'logging',
    description: "set log channel where bot will post information about passed events",
    aliases: ['log'],
    options: [{name: 'channel', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length != 1) return;
        try {
            const server = await client.database.getServer(guild.id);
            if(!server) throw Error("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw Error("Permission denied.");
            const channel = guild.channels.cache.get(args[0]);
            if(!channel) throw Error("Invalid channel id");
            if(channel.type != 'text' && channel.type != 'news') throw Error("Only text or news channel allowed");
            await client.database.updateSettings(guild.id, {logging_channel: channel.id});
            await message.channel.send(`Channel ${channel.name} successfuly set for logging.`);
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};