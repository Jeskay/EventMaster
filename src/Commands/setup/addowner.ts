import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'addowner',
    description: 'give user increased permissions for bot settings',
    aliases: ['setowner'],
    options: [{name: 'user', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length != 1) return;
        try {
            const server = await client.database.getServer(guild.id);
            if(!server) throw Error("Server is not registered yet.");
            const settings = server.settings;
            if(message.author.id != guild.ownerID) throw Error("Permission denied.");
            const userId = client.helper.extractID(args[0]);
            const user = guild.members.cache.get(userId);
            if(!user) throw Error("Cannot find a user.");
            if(settings.owners.includes(userId)) throw Error("This user already has owner permissions")
            settings.owners.push(userId);
            await client.database.updateSettings(server.guild, {
                owners: settings.owners
            });
            await message.channel.send(client.embeds.ownerAdded(user.displayName));
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};