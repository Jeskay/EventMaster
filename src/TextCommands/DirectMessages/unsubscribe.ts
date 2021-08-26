import {TextCommand} from '../../Interfaces';
import {subscribe} from '../../Commands/DirectMessages';

export const command: TextCommand = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    aliases: ['unsub'],
    options: [{name: 'title', type: "STRING"}],
    run: async(client, message, args) => {
        if(args.length > 1) return;
        try {
            const title = args[0];
            await subscribe(client,message.author, title);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 