import { start } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [{name: 'title', type: "STRING"}, {name: 'description', type: "STRING"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length < 2) throw new CommandError("Event name and description must be provided.");
            const title = args.shift()!;
            const description = args.join(' '); 
            await start(client, message.author, guild, title, description);
        }
        catch(error){
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        };
    }
};