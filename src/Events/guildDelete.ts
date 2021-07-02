import { Guild } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildDelete',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerID);
        /*send greeting message*/
        if(owner == null) return;
        let dm = owner.user.dmChannel;
        if(dm == null) dm = await owner.createDM();
        try {
            await client.database.removeServer(guild.id);
            await dm.send(client.embeds.farawell(guild.name, owner.user.username));
        } catch(error) {
            await dm.send(client.embeds.errorInformation(error));
        }
    }
}