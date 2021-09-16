"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedManager = void 0;
const discord_js_1 = require("discord.js");
const defaultImageUrl = "https://cdn.theatlantic.com/thumbor/b-GfuBo5WHQpYMuN_mjlLHw5xO4=/461x265:1541x1345/1080x1080/media/img/mt/2018/03/AP_325360162607/original.jpg";
class EmbedManager {
    constructor() {
        this.LikeHost = (id) => new discord_js_1.MessageButton()
            .setStyle(3)
            .setCustomId(id)
            .setEmoji('👍');
        this.DislikeHost = (id) => new discord_js_1.MessageButton()
            .setStyle(4)
            .setCustomId(id)
            .setLabel('👎');
        this.NextButton = (id) => new discord_js_1.MessageButton()
            .setStyle(1)
            .setCustomId(id)
            .setLabel('▶️');
        this.PreviusButton = (id) => new discord_js_1.MessageButton()
            .setStyle(1)
            .setCustomId(id)
            .setLabel('◀️');
        this.ListMessage = (prevId, nextId) => new discord_js_1.MessageActionRow()
            .addComponents(this.PreviusButton(prevId), this.NextButton(nextId));
        this.HostCommend = (likeId, dislikeId) => new discord_js_1.MessageActionRow()
            .addComponents(this.LikeHost(likeId), this.DislikeHost(dislikeId));
        this.startedOccasion = new discord_js_1.MessageEmbed()
            .setTitle("Event started!")
            .setFooter("Notification will be automatically posted to the notification channel.")
            .setColor("WHITE");
        this.finishedOccasion = new discord_js_1.MessageEmbed()
            .setTitle("Event finished!")
            .setFooter("Don't forget to commend host. The room will be deleted 5 seconds later.")
            .setColor("WHITE");
        this.voting = new discord_js_1.MessageEmbed()
            .setTitle("Time for the election!")
            .setFooter("Use **.vote** command to vote for the host.")
            .setColor("WHITE");
        this.voteConfimation = (candidate) => new discord_js_1.MessageEmbed()
            .addField("Information", `Vote for ${candidate} was confirmed.`)
            .setFooter("We let you know when the election will be finished.")
            .setColor("GREEN");
        this.electionFinished = (winner) => new discord_js_1.MessageEmbed()
            .setTitle("The election is over!")
            .addField(`Welcome your new host - ${winner}`, "Since that moment he's responsible for **everything** that happens in this channel.")
            .setFooter("Don't forget to rate your host after the game.")
            .setColor("PURPLE");
        this.occasionNotification = (name, description, host, image) => new discord_js_1.MessageEmbed()
            .setTitle(name !== null && name !== void 0 ? name : "New occasion is about to start!")
            .setDescription(description)
            .setFooter(`announce by ${host}`)
            .setImage(image !== null && image !== void 0 ? image : defaultImageUrl)
            .setColor("PURPLE");
        this.occasionStarted = (title, description, hostName, members) => new discord_js_1.MessageEmbed()
            .setTitle(`Event ${title} started`)
            .setDescription(description)
            .addField("Host:", hostName)
            .addField("Members when started:", members.toString())
            .setColor("PURPLE");
        this.occasionFinished = (title, description, hostName, minutes, members) => new discord_js_1.MessageEmbed()
            .setTitle(`Event finished`)
            .addField("Title:", title)
            .setDescription(description)
            .addField("Host:", hostName)
            .addField("Members when finished:", members.toString())
            .addField("Minutes played:", minutes.toString())
            .setColor("PURPLE");
        this.occasionStartResponse = (title, description) => new discord_js_1.MessageEmbed()
            .setTitle(`Occasion ${title} started`)
            .setDescription(description)
            .setColor("GREEN");
        this.occasionFinishResponse = (title, time) => new discord_js_1.MessageEmbed()
            .setTitle(`Occasion ${title} finished`)
            .addField("Lasted for", `${time} minutes`)
            .setColor("GREEN");
        this.announcePublishedResponse = (tags) => new discord_js_1.MessageEmbed()
            .setTitle(`Announce published`)
            .addField("Users with these tags will be notified:", tags.join('\n'))
            .setColor("GREEN");
        this.playerCommended = (user) => new discord_js_1.MessageEmbed()
            .setTitle(`${user.username}'s rating changed`)
            .setFooter("Thank you for improving our community.")
            .setColor("GREEN");
        this.hostCommended = () => new discord_js_1.MessageEmbed()
            .setTitle("Host's rating changed")
            .setFooter("Thank you for improving our community.")
            .setColor("GREEN");
        this.addedToBlackList = (user) => new discord_js_1.MessageEmbed()
            .setTitle("User added to event blacklist!")
            .addField("Guild member was blacklisted in your server.", `Since that moment ${user} can't host or participate events in your server.`)
            .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
            .setColor("RED");
        this.removedFromBlackList = (user) => new discord_js_1.MessageEmbed()
            .setTitle("User removed from blacklist!")
            .addField("Congratulations!", `Since that moment ${user} can participate any events in this server and nomimated as host.`)
            .setColor("GREEN");
        this.ownerAdded = (username) => new discord_js_1.MessageEmbed()
            .setTitle("User's permissions increased!")
            .addField("Congratulations!", `Since that moment ${username} has access to all commands of the bot.`)
            .addField("Prescription", "However, **only** server owner can edit owners list.")
            .setColor("GREEN");
        this.ownerRemoved = (username) => new discord_js_1.MessageEmbed()
            .setTitle("User's permission denied!")
            .addField("Guild member was removed from owners list", `Since that moment ${username} has limited access to bot commands.`)
            .setColor("RED");
        this.limitChanged = (limit) => new discord_js_1.MessageEmbed()
            .setTitle("Limit changed successfuly")
            .setDescription(`Minimum amount of members to start an occasion was changed to ${limit}`)
            .setColor("GREEN");
        this.unsubscribed = (tag) => new discord_js_1.MessageEmbed()
            .setTitle(`Tag ${tag} was successfuly removed from subscriptions`)
            .setDescription("You won't receive notifications about this type of occasions.")
            .setColor("DARK_GREEN");
        this.subscribed = (tag) => new discord_js_1.MessageEmbed()
            .setTitle(`Tag ${tag} successfuly added to personal subscribtions.`)
            .setDescription("Bot will send you notification about this type of occasions.")
            .setColor("GREEN");
        this.errorInformation = (error, message) => new discord_js_1.MessageEmbed()
            .addField(error, message)
            .setFooter("Use help command for detailes.")
            .setColor("RED");
        this.greeting = (guild, owner) => new discord_js_1.MessageEmbed()
            .setTitle("I will start my job right after you set me up.")
            .addField("Information", `Dear, ${owner}, thank you for inviting me to ${guild}`)
            .setFooter("Use help command for detailes.")
            .setColor("WHITE");
        this.farawell = (guild, owner) => new discord_js_1.MessageEmbed()
            .setTitle("Information about guild will be removed from our database.")
            .addField("Information", `Dear, ${owner}, thank you for using our service in ${guild}`)
            .setFooter("Please, send us a letter to let us know why you decided to stop using our service. We will make neccessary improvements.")
            .setColor("WHITE");
    }
    InviteMessage(inviteUrl, guild) {
        const button = new discord_js_1.MessageButton()
            .setStyle('LINK')
            .setLabel(guild)
            .setURL(inviteUrl);
        const row = new discord_js_1.MessageActionRow()
            .addComponents(button);
        return row;
    }
    notification(title, description, url, banner) {
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`${title} is about to start.`)
            .setDescription(description)
            .setURL(url)
            .setColor("GREEN");
        if (banner)
            embed.setThumbnail(banner);
        return embed;
    }
    playerInfo(player, user, commends) {
        const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
        const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
        const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
        const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
        return new discord_js_1.MessageEmbed()
            .setTitle(user.username)
            .addField("Events played:", player.eventsPlayed.toString())
            .addField("Events hosted:", player.eventsHosted.toString())
            .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
            .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`)
            .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`)
            .addField("First event:", player.joinedAt.toLocaleString())
            .setColor("PURPLE");
    }
}
exports.EmbedManager = EmbedManager;
