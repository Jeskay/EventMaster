import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'dislike',
    description: "Send a negative comment about user",
    aliases: [],
    run: async(client, message, args) => {
        if(message.guild) return;
        if(args.length != 1) return;
        try {
            let userId = args[0];
            if(message.guild)
                userId = client.helper.extractID(args[0]);
            const user = await client.users.cache.get(userId);
            if(!user) throw Error("User does not exists.");
            await client.ratingController.DislikePlayer(client, user.id, message.author.id);
            await message.channel.send(client.embeds.playerCommended(user));
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 