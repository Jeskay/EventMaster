import {TextCommand} from '../../Interfaces';
import {playerRating} from '../../Commands/DirectMessages'

export const command: TextCommand = {
    name: 'rating',
    description: 'Shows global player rating.' ,
    options: [],
    aliases: ['rate', 'ranking'],
    run: async(client, message, _args) => {
        try {
            await playerRating(client, message.author, message.channel);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 