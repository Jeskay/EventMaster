import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'nextPage',
    description: "",
    run: async(client, component, args) => {
        try {
            if(args.length != 1) throw Error("Only one argument required.");
            const author = args[0];
            if(author != component.clicker.id) return;
            const embed = await client.helpList.next(component.message.id);
            await component.message.edit(embed);
            component.reply.defer(true);
        } catch(error) {
            await component.reply.send(client.embeds.errorInformation(error), {ephemeral: true});
        }
    }
};