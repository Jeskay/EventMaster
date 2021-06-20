import { Guild, MessageEmbed } from 'discord.js';
import { Event } from '../Interfaces';
import {Settings} from "../entities/settings"

export const event: Event = {
    name: 'guildCreate',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerID);
        const default_limit = 2;
        /*send greeting message*/
        if(owner == null) return;
        const embed = new MessageEmbed()
        .setFooter("To configure use *setup* command right there.")
        .setDescription(`Thank you for inviting ${client.user?.username} to ${guild.name} ^^`);
        const settings = new Settings(owner.id, default_limit, []);
        const added = await client.database.addServer({
            settings: settings,
            events: [],
            guild: guild.id,
            description: "empty"
        });
        if(added){
            let dm = owner.user.dmChannel;
            if(dm == null) dm = await owner.createDM();
            dm.send(embed);
        }
    }
}