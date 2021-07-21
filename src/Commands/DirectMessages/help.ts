import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    run: async(client, message, _args) => {
        try {
            const prevId = `previousPage.${message.author.id}`;
            const nextId = `nextPage.${message.author.id}`;
            await client.helpList.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        } catch(error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    }
}; 