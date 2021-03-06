import { Message } from 'discord.js';
import { CommandError, handleCommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'previousPage',
    description: "",
    run: async(client, button, args) => {
        try{
            if(args.length != 2) throw new CommandError("Only one argument required.");
            const author = args[0];
            const list = client.lists.get(args[1]);
            if(!list) return;
            if(author != button.user.id) return;
            const embed = await list.previous(button.message.id);
            await (button.message as Message).edit({embeds: [embed]});
            await button.deferUpdate({fetchReply: true});
        } catch(error) {
            handleCommandError(client, button, error);
        }
    }
};