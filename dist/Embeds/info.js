"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.farawell = exports.greeting = exports.occasionNotification = exports.electionFinished = exports.voteConfimation = exports.voting = exports.InviteMessage = exports.occasionFinished = exports.occasionStarted = exports.finishedOccasion = exports.startedOccasion = exports.errorInformation = exports.notification = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
function notification(title, description, url, banner) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${title} is about to start.`)
        .setDescription(description)
        .setURL(url)
        .setColor(_1.infoColor);
    if (banner)
        embed.setThumbnail(banner);
    return embed;
}
exports.notification = notification;
const errorInformation = (error, message, stack) => new discord_js_1.MessageEmbed()
    .addField(stack ? "Unexpected Error" : error, stack ? "Congratulations, you've found a bug, please contact with support and describe the situation." : message)
    .setFooter("Use help command for detailes.")
    .setColor(_1.errorColor);
exports.errorInformation = errorInformation;
exports.startedOccasion = new discord_js_1.MessageEmbed()
    .setTitle("Event started!")
    .setFooter("Notification will be automatically posted to the notification channel.")
    .setColor(_1.infoColor);
exports.finishedOccasion = new discord_js_1.MessageEmbed()
    .setTitle("Event finished!")
    .setFooter("Don't forget to commend host. The room will be deleted 5 seconds later.")
    .setColor(_1.infoColor);
const occasionStarted = (title, description, hostName, members) => new discord_js_1.MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when started:", members.toString())
    .setColor(_1.infoColor);
exports.occasionStarted = occasionStarted;
const occasionFinished = (title, description, hostName, minutes, members) => new discord_js_1.MessageEmbed()
    .setTitle(`Event finished`)
    .addField("Title:", title)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when finished:", members.toString())
    .addField("Minutes played:", minutes.toString())
    .setColor(_1.infoColor);
exports.occasionFinished = occasionFinished;
function InviteMessage(inviteUrl, guild) {
    const button = new discord_js_1.MessageButton()
        .setStyle('LINK')
        .setLabel(guild)
        .setURL(inviteUrl);
    const row = new discord_js_1.MessageActionRow()
        .addComponents(button);
    return row;
}
exports.InviteMessage = InviteMessage;
const voting = (limit) => new discord_js_1.MessageEmbed()
    .setTitle("Time for the election!")
    .setDescription(`Participants need to choose a host - person who will be responsible for the event.
Host have **all** permissions in the text and voice channels, so you need to choose carefully. 
If you don't like the elected host feel free to leave the channel and create new event.`)
    .addField("How I can vote for someone?", `Use \`/player vote\` and \`/player voteid\` commands or user's application menu \`vote\`.
If you really care about anonymous of your vote, you can use \`/player voteid\` command in bot's DM. 
Nobody will know you voted for that guy.
`)
    .addField("How much votes I need to be a host?", ` A person needs to receive \`${limit}\` votes to **immidiately** become a host.
The amount of votes was set by server's administration.`)
    .addField("What happens when host leave the voice channel?", `Host will keep his permissions even if he leave a voice channel. 
He will lose all permissions when event finishes. 
Event will be forced to finish if the host will stay alone in the channel for too long or there will be no people at the channel.`)
    .setColor("WHITE");
exports.voting = voting;
const voteConfimation = (candidate) => new discord_js_1.MessageEmbed()
    .addField("Information", `Vote for ${candidate} was confirmed.`)
    .setFooter("We let you know when the election will be finished.")
    .setColor(_1.confirmColor);
exports.voteConfimation = voteConfimation;
const electionFinished = (winnerId) => new discord_js_1.MessageEmbed()
    .setTitle("The election is over!")
    .addField(`Welcome your new host - <@!${winnerId}>`, "Since that moment he's responsible for **everything** that happens in this channel.")
    .addField("How a host should act?", `When everyone is ready you have to start an event \`/host start\`. 
When party is over don't forget to finish it \`/host finish\`, otherwise, the event won't be scored and players' statistics as well as the host's will **not** be changed.`)
    .addField("We need more people to participate", `Host can use \`/host announce\` command or message's application menu to create announce about your activity!
Remember, you can use tags in the event description to notify subscribed users across the discord about the event.
Example: \`/host announce title:My cool party description:We gonna play #Uno #Alias and much more \`
To prevent spam abuse the command has a cooldown time, use it carefully.`)
    .addField("How can I get notifications?", `All you need is subscribe for events you want to participate.
Use \`/system subscribe\` to add a new tag to your subscriptions \`/system subscriptions\`. You don't need to pass \`#\` symbol!
Example: \`/system subscribe tag:Uno\`
`)
    .setColor(_1.infoColor);
exports.electionFinished = electionFinished;
const occasionNotification = (name, description, host, image) => new discord_js_1.MessageEmbed()
    .setTitle(name !== null && name !== void 0 ? name : "New occasion is about to start!")
    .setDescription(description)
    .setFooter(`announce by ${host}`)
    .setImage(image !== null && image !== void 0 ? image : _1.defaultImageUrl)
    .setColor(_1.infoColor);
exports.occasionNotification = occasionNotification;
const greeting = (guild, owner) => new discord_js_1.MessageEmbed()
    .setTitle("I will start my job right after you set me up.")
    .addField("Information", `Dear, ${owner}, thank you for inviting me to ${guild}`)
    .addField("Setting up", `First of all players need a room to play. 
Use command \`/owner setup\` to select category where bot will create voice and text channels for players and voice channel where people will join to initiate an event.
That's all you need to help guild members organize their own events!`)
    .addField("Useful commands", ` Commmands in \`/owner\` section are the ones only server owner can use.
They allow you to change bot settings such as amount of current events, minimum votes for host election, log channel, channel for announces, role to mention in announces etc.
Also, you can give someone administrator rights - \`/owner setadmin\`.
Administrator has permission to block members from playing events (hosts have permission to open channel for blocked users) or unblock them.
Blocked users have a special badge in profile and receive less rank points from playing events even on other servers.`)
    .setColor(_1.infoColor);
exports.greeting = greeting;
const farawell = (guild, owner) => new discord_js_1.MessageEmbed()
    .setTitle("Information about guild will be removed from our database.")
    .addField("Information", `Dear, ${owner}, thank you for using our service in ${guild}`)
    .setFooter("Please, send us a letter to let us know why you decided to stop using our service. We will make neccessary improvements.")
    .setColor(_1.infoColor);
exports.farawell = farawell;
