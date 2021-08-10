import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [{name: 'title', required: true}, {name: 'description', required: true}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            if(args.length < 2) throw Error("Event name and description must be provided.");
            const title = args.shift();
            if(!title) throw Error("Event title can't be empty.");
            const description = args.join(' ');
            await client.occasionController.Announce(client, title, description, guild, message.author);
            
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};