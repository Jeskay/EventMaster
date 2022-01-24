import { User, MessageEmbed } from "discord.js";
import { confirmColor } from ".";

export const playerCommended = (user: User) => new MessageEmbed()
    .setTitle(`${user.username}'s rating changed`)
    .setDescription("Thank you for improving our community.")
    .setColor(confirmColor);

export const hostCommended = () => new MessageEmbed()
    .setTitle("Host's rating changed")
    .setDescription("Thank you for improving our community.")
    .setColor(confirmColor);

export const addedToBlackList = (user: string) => new MessageEmbed()
    .setTitle("User added to event blacklist!")
    .setDescription(`Since that moment <@!${user}> can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor(confirmColor);

    export const removedFromBlackList = (user: string) => new MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment <@!${user}> can participate any events in this server and nomimated as host.`)
    .setColor(confirmColor);

    export const ownerAdded = (username: string) => new MessageEmbed()
    .setTitle("User's permissions increased!")
    .addField("Congratulations!", `Since that moment ${username} has access to all commands of the bot.`)
    .addField("Prescription", "However, **only** server owner can edit owners list.")
    .setColor(confirmColor);

    export const ownerRemoved = (username: string) => new MessageEmbed()
    .setTitle("User's permission denied!")
    .addField("Guild member was removed from owners list", `Since that moment ${username} has limited access to bot commands.`)
    .setColor("RED");

    export const limitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Minimum amount of members to start an event was changed to ${limit}`)
    .setColor(confirmColor);

    export const occasionLimitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Maximum amount of events at the same time is limited to ${limit}`)
    .setColor(confirmColor);

    export const unsubscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} was successfuly removed from subscriptions`)
    .setDescription("You won't receive notifications about this type of events.")
    .setColor(confirmColor);

    export const subscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} successfuly added to personal subscribtions.`)
    .setDescription("Bot will send you notification about this type of events.")
    .setColor(confirmColor);
    
    export const logRiggedUp = (channel: string) => new MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for logging.`)
    .setDescription("All information about events will be published in this channel.")
    .setColor(confirmColor);
    
    export const notificationRoleAccepted = (role: string) => new MessageEmbed()
    .setTitle(`Role ${role} accepted as notification role.`)
    .setDescription("Bot will mention it in announcement messages.")
    .setColor(confirmColor);

    export const notificationChannelRiggedUp = (channel: string) => new MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for notifications.`)
    .setDescription("Bot will publish announcments about current events there.")
    .setColor(confirmColor);
    
    export const occasionsRiggedUp = (channel: string, category: string) => new MessageEmbed()
    .setTitle(`Bot environment successfuly established.`)
    .setDescription(`Bot will create voice and text channels in ${category} category every time someone joins ${channel} channel.`)
    .setColor(confirmColor);
    
    export const occasionStartResponse = (title: string, description: string) => new MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .setColor(confirmColor);

    export const occasionFinishResponse = (title: string, time: number) => new MessageEmbed()
    .setTitle(`Event ${title} finished`)
    .addField("Lasted for",`${time} minutes`)
    .setColor(confirmColor);

    export function announcePublishedResponse(tags: string[]){
        const embed = new MessageEmbed()
        .setTitle(`Announce published`)
        .setColor(confirmColor);
        if(tags.length > 0)
            embed.addField("Users with these tags will be notified:", tags.join('\n'))
        else
            embed.setDescription("No Event tags detected. To use them, write #YOUR_TAG anywhere in your message.")
        return embed;
    }