import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'dislike',
    aliases: [],
    run: async(client, message, args) => {
        if(args.length != 1) return;
        const userId = client.helper.extractID(args[0]);
        try {
            const user = await client.users.cache.get(userId);
            if(!user) throw Error("User does not exists.");
            await client.ratingController.DislikePlayer(client, user.id, message.author.id);
            await message.channel.send(client.embeds.playerCommended(user));
        } catch(error) {
            await message.channel.send(error);
        }
    }
}; 