import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'removeowner',
    description: 'deny user permissions for bot settings',
    aliases: ['deleteowner'],
    options: [{name: 'user', required: true}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 1) return;
            const server = await client.database.getServer(guild.id);
            if(!server) throw new CommandError("Server is not registered yet.");
            const settings = server.settings;
            if(message.author.id != guild.ownerId) throw new CommandError("Permission denied.");
            const userId = client.helper.extractID(args[0]);
            const user = guild.members.cache.get(userId);
            if(!user) throw new CommandError("Cannot find a user.");
            if(!settings.owners.includes(userId)) throw new CommandError("This user does not have owner permissions")
            settings.owners.filter(id => id != userId);
            await client.database.updateSettings(server.guild, {
                owners: settings.owners
            });
            await message.channel.send({embeds: [client.embeds.ownerRemoved(user.displayName)]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};