import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    run: async(client, message, _args) => {
        try {
            const prevId = `previousPage.${message.author.id} help`;
            const nextId = `nextPage.${message.author.id} help`;
            const list = client.Lists.get('help');
            if(!list) throw Error('System error');
            await list.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
}; 