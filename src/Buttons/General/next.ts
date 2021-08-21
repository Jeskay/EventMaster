import { Message } from 'discord.js';
import { CommandError } from '../../Error';
import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'nextPage',
    description: "",
    run: async(client, component, args) => {
        try{
            if(args.length != 2) throw new CommandError("Not enough information.");
            const author = args[0];
            const list = client.Lists.get(args[1]);
            if(!list) return;
            if(author != component.user.id) return;
            const embed = await list.next(component.message.id);
            await (component.message as Message).edit({embeds: [embed]});
            await component.deferUpdate({fetchReply: true});
        } catch(error) {
            if(error instanceof Error)
                component.reply({embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true});
        }
    }
};