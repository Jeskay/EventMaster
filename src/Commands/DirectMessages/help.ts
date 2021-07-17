import {Command} from '../../Interfaces';
import { MessageEmbed } from 'discord.js'
import console from 'console';

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    run: async(client, message, _args) => {
        const author = message.author;
        let dm = author.dmChannel;
        if(message.guild == null) return;
        if(dm == null)dm = await author.createDM();
        const server = await client.database.getServer(message.guild.id);
        console.log(server);
        if(server == null) return;
        const embed = new MessageEmbed()
        .setTitle("Server information")
        .setDescription(`Description: ${server.description}`)
        .addField("Channel", server.eventChannel)
        .setFooter("Footer");
        dm.send(embed);
        dm.send(`Server owner is ${server.settings.owners[0]}`);
    }
}; 