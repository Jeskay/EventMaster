import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg','finish'],
    options: [{name: 'result', required: true, description: 'Message that will be sent to log channel'}],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(!guild) return;
        try {
            if(args.length < 1) throw Error("Event results must be provided. Ask moderation about respond format.");
            await client.occasionController.Finish(client, guild, message.author, args.join(' '));
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
};