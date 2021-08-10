import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [{name: 'title', required: true}, {name: 'description', required: true, description: 'message that will be sent to log channel'}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            if(args.length < 2) throw Error("Event name and description must be provided.");
            const title = args.shift()!;
            const description = args.join(' '); 
            await client.occasionController.Start(client, guild, message.author, title, description);
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};