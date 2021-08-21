import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [{name: 'channel', required: true}, {name: 'category', required: true}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 2) return;
            const channel = args[0];
            const category = args[1];
            const server = await client.database.getServer(guild.id);
            if(!server) throw new CommandError("Server is not registered yet.");
            if(!server.settings.owners.includes(message.author.id)) throw new CommandError("Permission denied.");
            client.helper.validatePair(channel, category, guild);
            await client.database.updateServer(guild.id, {
                eventChannel: channel, 
                eventCategory: category
            });
            await message.channel.send("channel and category successfuly binded.");
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};