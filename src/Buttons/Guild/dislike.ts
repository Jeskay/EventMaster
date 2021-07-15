import {Button} from '../../Interfaces/Button';

export const button: Button = {
    name: 'dislikeHost',
    description: "",
    run: async(client, component, args) => {
        try {
            if(args.length != 1) throw Error("Too much arguments");
            const author = component.clicker.id;
            const host = args[0];
            await client.ratingController.dislikeHost(client, host, author);
            await component.reply.send(client.embeds.hostCommended(), {ephemeral: true});
        } catch(error) {
            await component.reply.send(client.embeds.errorInformation(error), {ephemeral: true});
        }
    }
};