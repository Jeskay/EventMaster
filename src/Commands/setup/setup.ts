import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'setup',
    aliases: ['s'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length != 2) return;
        const channel = args[0];
        const category = args[1];
        try {
            const server = await client.database.getServer(guild.id);
            if(!server) throw Error("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw Error("Permission denied.");
            client.helper.validatePair(channel, category, guild);
            await client.database.updateServer(guild.id, {
                eventChannel: channel, 
                eventCategory: category
            });
            await message.channel.send("channel and category successfuly binded.");
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};