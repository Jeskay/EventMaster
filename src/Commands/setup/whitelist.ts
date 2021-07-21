import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'whitelist',
    description: 'removes a user from the black list',
    aliases: ['wl'],
    options: [{name: 'user', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length != 1) return;
        try {
            const user = client.helper.extractID(args[0]);
            const server = await client.database.getServer(guild.id);
            if(!server) throw Error("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw Error("Permission denied.");
            const list = server.settings.black_list;
            list.splice(list.indexOf(user));
            await client.database.updateSettings(guild.id, {black_list: list});
            await message.channel.send(client.embeds.removedFromBlackList(args[0]));
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};