import { Guild } from 'discord.js';
import { Event } from '../Interfaces';
import {Settings} from "../entities/settings"

export const event: Event = {
    name: 'guildCreate',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerId);
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
            if(!client.user) throw Error("Unable to find bot's client.");
            await client.registerGuildCommands(guild, client.user.id);
            await dm.send({embeds: [client.embeds.greeting(guild.name, owner.user.username)]});
        } catch(error) {
            if(error instanceof Error)
                await dm.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
}