import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg','finish'],
    options: [{name: 'result', required: true, description: 'Message that will be sent to log channel'}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        if(args.length < 1) throw new CommandError("Event results must be provided. Ask moderation about respond format.");
        await client.occasionController.Finish(client, guild, message.author, args.join(' '));
    }
};