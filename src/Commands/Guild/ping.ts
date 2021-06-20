import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    aliases: ['p'],
    run: async(client, message, _args) => {
        message.channel.send(`${client.ws.ping} pong!`);
    }
};