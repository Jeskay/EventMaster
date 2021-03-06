import { Message } from 'discord.js';
import {Event, TextCommand} from '../Interfaces';

export const event: Event = {
    name: 'messageCreate',
    run: (client, message: Message) => {
        if(message.author.bot || !message.content.startsWith(client.config.prefix))
            return;
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const cmd = args.shift()?.toLowerCase();
        if(!cmd) return;
        const command = client.commands.get(cmd) || client.aliases.get(cmd);
        if(command) {
            (command as TextCommand).run(client, message, args);
            if(message.guild) message.delete().catch(error => console.log(error));
        }
    }
}