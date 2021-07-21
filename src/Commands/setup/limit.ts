import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'setlimit',
    description: 'set amount of users to start the host election',
    aliases: ['sl', 'limit'],
    options: [{name: 'amount', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length != 1) return;
        try {
            const server = await client.database.getServer(guild.id);
            if(!server) throw Error("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw Error("Permission denied.");
            const limit = parseInt(args[0]);
            await client.database.updateSettings(guild.id, {limit: limit});
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};