import { Guild } from 'discord.js';
import { Event } from '../Interfaces';
import {Settings} from "../entities/settings"

export const event: Event = {
    name: 'guildCreate',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerID);
        const default_limit = 2;
        if(owner == null) return;
        const settings = new Settings(owner.id, default_limit, []);
        let dm = owner.user.dmChannel;
        if(dm == null) dm = await owner.createDM();
        try {
            await client.database.addServer({
                settings: settings,
                events: [],
                guild: guild.id,
                description: "empty"
            });
            await dm.send(client.embeds.greeting(guild.name, owner.user.username));
        } catch(error) {
            await dm.send(client.embeds.errorInformation(error));
        }
    }
}