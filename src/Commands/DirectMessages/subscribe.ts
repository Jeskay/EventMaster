import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'subscribe',
    description: "subscribe for personal events notifications",
    aliases: ['sub'],
    options: [{name: 'title', required: true}],
    run: async(client, message, args) => {
        if(args.length > 1) return;
        try {
            const title = args[0];
            const profile = await client.database.getPlayer(message.author.id);
            if(!profile) throw Error("This user did not join events.");
            const tags = await profile.subscriptions;
            console.log(tags);
            if(tags.find(tag => tag.title == title)) throw Error("You are already subscribed for this tag");
            var tag = await client.database.getTag(title) ?? client.database.tag({title: title});
            await client.database.addTag(tag);
            tags.push(tag);
            profile.subscriptions = Promise.resolve(tags);
            console.log("updating");
            await client.database.updatePlayer(profile);
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 