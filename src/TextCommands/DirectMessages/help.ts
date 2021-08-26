import {TextCommand} from '../../Interfaces';
import {help} from '../../Commands/DirectMessages'

export const command: TextCommand = {
    name: 'help',
    options: [],
    aliases: ['h'],
    run: async(client, message, _args) => {
        try {
            await help(client, message.author, message.channel);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 