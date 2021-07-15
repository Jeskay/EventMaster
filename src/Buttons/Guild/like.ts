import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'likeHost',
    description: "",
    run: async(client, component, args) => {
        try {
            if(args.length != 1) throw Error("Only one argument required.");
            const author = component.clicker.id;
            const host = args[0];
            await client.ratingController.likeHost(client, host, author);
            await component.reply.send(client.embeds.hostCommended(), {ephemeral: true});
        } catch(error) {
            await component.reply.send(client.embeds.errorInformation(error), {ephemeral: true});
        }
    }
};