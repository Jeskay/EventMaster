import { CommandError } from '../../Error';
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
            if(!profile) throw new CommandError("This user did not join events.");
            const tags = await profile.subscriptions;
            if(!tags.find(tag => tag.title == title)) throw new CommandError("You are not subscribed for this tag.");
            await client.database.removeTag(title);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 