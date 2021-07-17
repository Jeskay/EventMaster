import console from 'console';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'like',
    description: "send a positive comment about user",
    aliases: [],
    run: async(client, message, args) => {
        if(args.length != 1) return;
        try {
            let userId = args[0];
            if(message.guild)
                userId = client.helper.extractID(args[0]);
            const user = await client.users.cache.get(userId);
            if(!user) throw Error("User does not exists.");
            await client.ratingController.LikePlayer(client, user.id, message.author.id);
            await message.channel.send(client.embeds.playerCommended(user));
        } catch(error) {
            console.log("Error");
            message.channel.send(error);
        }
    }
}; 