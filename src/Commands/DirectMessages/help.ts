import { CommandError } from '../../Error';
import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    run: async(client, message, _args) => {
        try{
            const prevId = `previousPage.${message.author.id} help`;
            const nextId = `nextPage.${message.author.id} help`;
            const list = client.Lists.get('help');
            if(!list) throw new CommandError('Command list not found.');
            await list.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}; 