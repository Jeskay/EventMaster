import { List } from '../../List';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'subscribtions',
    description: "shows your subscription list",
    aliases: ['subs'],
    run: async(client, message, args) => {
        if(args.length != 0) return;
        try {
            const profile = await client.database.getPlayer(message.author.id);
            if(!profile) throw Error("This user did not join events.");
            const subId = `subs${message.author.id}`;
            if(client.Lists.get(subId)) client.Lists.delete(subId);
            console.log("No duplicate");
            const tags = await profile.subscriptions;
            console.log("Subscriptions loaded");
            const list = new List(30, client.helper.subscriptionList(tags), 5);
            console.log("List created");
            client.Lists.set(subId, list);
            const prevId = `previousPage.${message.author.id} ${subId}`;
            const nextId = `nextPage.${message.author.id} ${subId}`;
            list.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        } catch(error) {
            message.channel.send(error);
        }
    }
}; 