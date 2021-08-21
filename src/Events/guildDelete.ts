import { Guild } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildDelete',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerId);
        /*send greeting message*/
        if(owner == null) return;
        let dm = owner.user.dmChannel;
        if(dm == null) dm = await owner.createDM();
        try {
            await client.database.removeServer(guild.id);
            await dm.send({embeds: [client.embeds.farawell(guild.name, owner.user.username)]});
        } catch(error) {
            if(error instanceof Error)
                await dm.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}