import { Message } from 'discord.js';
import { CommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'nextPage',
    description: "",
    run: async(client, button, args) => {
        try{
            if(args.length != 2) throw new CommandError("Not enough information.");
            const author = args[0];
            const list = client.Lists.get(args[1]);
            if(!list) return;
            if(author != button.user.id) return;
            const embed = await list.next(button.message.id);
            await (button.message as Message).edit({embeds: [embed]});
            await button.deferUpdate({fetchReply: true});
        } catch(error) {
            if(error instanceof Error)
                button.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};