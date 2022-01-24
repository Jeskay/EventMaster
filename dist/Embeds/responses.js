"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcePublishedResponse = exports.occasionFinishResponse = exports.occasionStartResponse = exports.occasionsRiggedUp = exports.notificationChannelRiggedUp = exports.notificationRoleAccepted = exports.logRiggedUp = exports.subscribed = exports.unsubscribed = exports.occasionLimitChanged = exports.limitChanged = exports.ownerRemoved = exports.ownerAdded = exports.removedFromBlackList = exports.addedToBlackList = exports.hostCommended = exports.playerCommended = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
const playerCommended = (user) => new discord_js_1.MessageEmbed()
    .setTitle(`${user.username}'s rating changed`)
    .setDescription("Thank you for improving our community.")
    .setColor(_1.confirmColor);
exports.playerCommended = playerCommended;
const hostCommended = () => new discord_js_1.MessageEmbed()
    .setTitle("Host's rating changed")
    .setDescription("Thank you for improving our community.")
    .setColor(_1.confirmColor);
exports.hostCommended = hostCommended;
const addedToBlackList = (user) => new discord_js_1.MessageEmbed()
    .setTitle("User added to event blacklist!")
    .setDescription(`Since that moment <@!${user}> can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor(_1.confirmColor);
exports.addedToBlackList = addedToBlackList;
const removedFromBlackList = (user) => new discord_js_1.MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment <@!${user}> can participate any events in this server and nomimated as host.`)
    .setColor(_1.confirmColor);
exports.removedFromBlackList = removedFromBlackList;
const ownerAdded = (username) => new discord_js_1.MessageEmbed()
    .setTitle("User's permissions increased!")
    .addField("Congratulations!", `Since that moment ${username} has access to all commands of the bot.`)
    .addField("Prescription", "However, **only** server owner can edit owners list.")
    .setColor(_1.confirmColor);
exports.ownerAdded = ownerAdded;
const ownerRemoved = (username) => new discord_js_1.MessageEmbed()
    .setTitle("User's permission denied!")
    .addField("Guild member was removed from owners list", `Since that moment ${username} has limited access to bot commands.`)
    .setColor("RED");
exports.ownerRemoved = ownerRemoved;
const limitChanged = (limit) => new discord_js_1.MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Minimum amount of members to start an event was changed to ${limit}`)
    .setColor(_1.confirmColor);
exports.limitChanged = limitChanged;
const occasionLimitChanged = (limit) => new discord_js_1.MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Maximum amount of events at the same time is limited to ${limit}`)
    .setColor(_1.confirmColor);
exports.occasionLimitChanged = occasionLimitChanged;
const unsubscribed = (tag) => new discord_js_1.MessageEmbed()
    .setTitle(`Tag ${tag} was successfuly removed from subscriptions`)
    .setDescription("You won't receive notifications about this type of events.")
    .setColor(_1.confirmColor);
exports.unsubscribed = unsubscribed;
const subscribed = (tag) => new discord_js_1.MessageEmbed()
    .setTitle(`Tag ${tag} successfuly added to personal subscribtions.`)
    .setDescription("Bot will send you notification about this type of events.")
    .setColor(_1.confirmColor);
exports.subscribed = subscribed;
const logRiggedUp = (channel) => new discord_js_1.MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for logging.`)
    .setDescription("All information about events will be published in this channel.")
    .setColor(_1.confirmColor);
exports.logRiggedUp = logRiggedUp;
const notificationRoleAccepted = (role) => new discord_js_1.MessageEmbed()
    .setTitle(`Role ${role} accepted as notification role.`)
    .setDescription("Bot will mention it in announcement messages.")
    .setColor(_1.confirmColor);
exports.notificationRoleAccepted = notificationRoleAccepted;
const notificationChannelRiggedUp = (channel) => new discord_js_1.MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for notifications.`)
    .setDescription("Bot will publish announcments about current events there.")
    .setColor(_1.confirmColor);
exports.notificationChannelRiggedUp = notificationChannelRiggedUp;
const occasionsRiggedUp = (channel, category) => new discord_js_1.MessageEmbed()
    .setTitle(`Bot environment successfuly established.`)
    .setDescription(`Bot will create voice and text channels in ${category} category every time someone joins ${channel} channel.`)
    .setColor(_1.confirmColor);
exports.occasionsRiggedUp = occasionsRiggedUp;
const occasionStartResponse = (title, description) => new discord_js_1.MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .setColor(_1.confirmColor);
exports.occasionStartResponse = occasionStartResponse;
const occasionFinishResponse = (title, time) => new discord_js_1.MessageEmbed()
    .setTitle(`Event ${title} finished`)
    .addField("Lasted for", `${time} minutes`)
    .setColor(_1.confirmColor);
exports.occasionFinishResponse = occasionFinishResponse;
function announcePublishedResponse(tags) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`Announce published`)
        .setColor(_1.confirmColor);
    if (tags.length > 0)
        embed.addField("Users with these tags will be notified:", tags.join('\n'));
    else
        embed.setDescription("No Event tags detected. To use them, write #YOUR_TAG anywhere in your message.");
    return embed;
}
exports.announcePublishedResponse = announcePublishedResponse;
