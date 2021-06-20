import { CategoryChannel, Guild } from 'discord.js';
import {Command} from '../../Interfaces';
function validate_channel(channelID: string, guild: Guild) {
    const channel = guild.channels.cache.get(channelID);
    if(channel == undefined) return "Cannot find the channel";
    return channel
}
function validate_category(categoryID: string, guild: Guild) {
    const category = guild.channels.cache.get(categoryID) as CategoryChannel;
    if(category == undefined) return "Cannot find the category";
    return category;
}
export const command: Command = {
    name: 'setup',
    aliases: ['s'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(guild == null) return;
        if(args.length != 2) message.channel.send("The format of request is **channelId sectionId**");
        const channel = validate_channel(args[0], guild);
        const category = validate_category(args[1], guild);
        if(typeof channel == "string") message.channel.send(channel);
        else if(typeof category == "string") message.channel.send(category);
        else if(category.children.find(channel => channel.id == channel.id)){
            const result = await client.database.updateServer(guild.id, {
                eventChannel: channel.id, 
                eventCategory: category.id
            });
            if(result)await message.channel.send("channel and category successfuly binded.");
            else await message.channel.send("something went wrong");
        }
        else await message.channel.send(`Channel ${channel.name} is not in ${category.name} category.`);
    }
};