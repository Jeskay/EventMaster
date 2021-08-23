import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'subscribe',
    description: "subscribe for personal events notifications",
    aliases: ['sub'],
    options: [{name: 'title', required: true}],
    run: async(client, message, args) => {
        try {
            if(args.length > 1) return;
            const title = args[0];
            const profile = await client.database.getPlayer(message.author.id);
            if(!profile) throw new CommandError("This user did not join events.");
            const tags = await profile.subscriptions;
            if(tags.find(tag => tag.title == title)) throw new CommandError("You are already subscribed for this tag.");
            var tag = await client.database.getTag(title) ?? client.database.tag({title: title});
            await client.database.addTag(tag);
            tags.push(tag);
            profile.subscriptions = Promise.resolve(tags);
            await client.database.updatePlayer(profile);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 