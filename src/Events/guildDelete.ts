import { Guild } from 'discord.js';
import { errorInformation, farawell } from '../Embeds';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildDelete',
    run: async (client, guild: Guild) => {
        const owner = await client.users.fetch(guild.ownerId);
        /*send greeting message*/
        if(owner == null) return;
        let dm = owner.dmChannel;
        if(dm == null) dm = await owner.createDM();
        try {
            await client.database.removeServer(guild.id);
            await dm.send({embeds: [farawell(guild.name, owner.username)]});
        } catch(error) {
            if(error instanceof Error)
                await dm.send({embeds: [errorInformation(error.name, error.message)]});
        }
    }
}