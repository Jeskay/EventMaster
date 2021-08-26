import {Event} from '../Interfaces';

export const event: Event = {
    name: 'ready',
    run: async (client) => {
        if(!client.user) throw new Error("User is null");
        const clientId = client.user.id;;
        console.log(`${client.user.tag} is online`);
        await Promise.all(client.guilds.cache.map(async(guild) => {await client.registerGuildCommands(guild, clientId)}));
        await client.registerGlobalCommands();
        await client.registerContextMenu();
    }
}