import {Event} from '../Interfaces';

export const event: Event = {
    name: 'ready',
    run: async (client) => {
        console.log("ready");
        if(!client.user) throw new Error("User is null");
        const clientId = client.user.id;;
        console.log(`${client.user.tag} is online`);
        await client.registerGuildCommands(client, client.guilds.cache, clientId);
        await client.registerGlobalCommands();
    }
}