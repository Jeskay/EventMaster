import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    aliases: ['unsub'],
    options: [{name: 'title', required: true}],
    run: async(client, message, args) => {
        if(args.length > 1) return;
        try {
            const title = args[0];
            const profile = await client.database.getPlayer(message.author.id);
            if(!profile) throw Error("This user did not join events.");
            const tags = await profile.subscriptions;
            if(!tags.find(tag => tag.title == title)) throw Error("You are not subscribed for this tag");
            await client.database.removeTag(title);
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 