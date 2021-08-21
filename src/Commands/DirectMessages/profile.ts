import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    options: [{name: 'user', required: false}],
    run: async(client, message, args) => {
        try {
            if(args.length > 1) return;
            let userId = args[0];
            if(args.length == 0) userId = message.author.id;
            else if(message.guild)
                userId = client.helper.extractID(args[0]);
            const profile = await client.database.getPlayer(userId);
            if(!profile) throw new CommandError("This user did not join events.");
            const user = await client.users.cache.get(userId);
            if(!user) throw new CommandError("User does not exists.");
            const commends = await profile.commendsAbout;
            await message.channel.send({embeds: [client.embeds.playerInfo(profile, user, commends)]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 