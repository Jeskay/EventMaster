import { finish } from '../../Commands/Guild';
import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';

export const command: TextCommand = {
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg','finish'],
    options: [{name: 'result', type: "STRING"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length < 1) throw new CommandError("Event results must be provided. Ask moderation about respond format.");
            await finish(client, message.author, guild, args.join(' '));
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};