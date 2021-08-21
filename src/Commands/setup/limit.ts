import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'setlimit',
    description: 'set amount of users to start the host election',
    aliases: ['sl', 'limit'],
    options: [{name: 'amount', required: true}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const server = await client.database.getServer(guild.id);
            if(!server) throw new CommandError("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw new CommandError("Permission denied.");
            const limit = parseInt(args[0]);
            await client.database.updateSettings(guild.id, {limit: limit});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};