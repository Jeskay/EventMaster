import { announce } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [{name: 'title', type: "STRING"}, {name: 'description', type: "STRING"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length < 2) throw new CommandError("Event name and description must be provided.");
            const title = args.shift();
            if(!title) throw new CommandError("Event title can't be empty.");
            const description = args.join(' ');
            await announce(client, message.author, guild, description, title);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};