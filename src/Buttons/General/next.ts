import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'nextPage',
    description: "",
    run: async(client, component, args) => {
        try {
            if(args.length != 2) throw Error("Not enough information.");
            const author = args[0];
            const list = client.Lists.get(args[1]);
            if(!list) return;
            if(author != component.clicker.id) return;
            const embed = await list.next(component.message.id);
            await component.message.edit(embed);
            component.reply.defer(true);
        } catch(error) {
            await component.reply.send(client.embeds.errorInformation(error), {ephemeral: true});
        }
    }
};