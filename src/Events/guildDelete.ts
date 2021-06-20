import { Guild, MessageEmbed } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'guildDelete',
    run: async (client, guild: Guild) => {
        const owner = await guild.members.fetch(guild.ownerID);
        /*send greeting message*/
        if(owner == null) return;
        const embed = new MessageEmbed()
        .setFooter("Information about guild will be removed from our database.")
        .setDescription(`Thank you for using ${client.user?.username} in ${guild.name}. Hope we will see you soon.`);
        const removed = await client.database.removeServer(guild.id);
        if(removed){
            let dm = owner.user.dmChannel;
            if(dm == null) dm = await owner.createDM();
            dm.send(embed);
        }
    }
}