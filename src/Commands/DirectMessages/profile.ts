import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    run: async(client, message, args) => {
        if(args.length > 1) return;
        try {   
            let userId = args[0];
            if(args.length == 0) userId = message.author.id;
            else if(message.guild)
                userId = client.helper.extractID(args[0]);
            const profile = await client.database.getPlayer(userId);
            if(!profile) throw Error("This user did not join events.");
            const user = await client.users.cache.get(userId);
            if(!user) throw Error("User does not exists.");
            const commends = await profile.commendsAbout;
            await message.channel.send(client.embeds.playerInfo(profile, user, commends));
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 