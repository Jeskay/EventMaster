import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'blacklist',
    description: 'add user to black list, so he cannot became host on this server',
    aliases: ['bl'],
    options: [{name: 'user', required: true}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const user = client.helper.extractID(args[0]);
            const server = await client.database.getServer(guild.id);
            if(!server) throw new CommandError("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw new CommandError("Permission denied.");
            const list = server.settings.black_list;
            list.push(user);
            await client.database.updateSettings(guild.id, {black_list: list});
            await message.channel.send({embeds: [client.embeds.addedToBlackList(args[0])]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};