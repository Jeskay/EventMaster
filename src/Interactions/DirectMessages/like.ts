import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'like',
    description: "send a positive comment about user",
    options: [{name: 'userId', required: true}],
    run: async(client, message, args) => {
        try {
            if(args.length != 1) return;
            let userId = args[0];
            if(message.guild)
                userId = client.helper.extractID(args[0]);
            const user = client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            await client.ratingController.LikePlayer(client, user.id, message.author.id);
            await message.channel.send({embeds:[client.embeds.playerCommended(user)]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 