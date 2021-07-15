import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'profile',
    aliases: ['info'],
    run: async(client, message, args) => {
        if(args.length != 1) return;
        const userId = client.helper.extractID(args[0]);
        try {   
            const profile = await client.database.getPlayer(userId);
            if(!profile) throw Error("This user did not join events.");
            const user = await client.users.cache.get(userId);
            if(!user) throw Error("User does not exists.");
            await message.channel.send(client.embeds.playerInfo(profile, user));
        } catch(error) {
            await message.channel.send(error);
        }
    }
}; 