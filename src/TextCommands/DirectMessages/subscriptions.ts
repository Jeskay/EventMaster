import {TextCommand} from '../../Interfaces';
import { subscriptions } from '../../Commands/DirectMessages';

export const command: TextCommand = {
    name: 'subscribtions',
    description: "shows your subscription list",
    aliases: ['subs'],
    options: [],
    run: async(client, message, args) => {
        if(args.length != 0) return;
        try {
            await subscriptions(client, message.author, message.channel);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 