import { User, MessageEmbed, MessageButton, MessageActionRow, ColorResolvable } from "discord.js";
import { GuildMember } from "src/entities/member";
import { Commend } from "../entities/commend";
import { Player } from "../entities/player";
const defaultImageUrl = "https://i.pinimg.com/564x/7c/73/c2/7c73c263484564935023c892801d393c.jpg";

export class EmbedManager{
    private confirmColor: ColorResolvable = "GREEN";
    private errorColor: ColorResolvable = "RED";
    private infoColor: ColorResolvable = "YELLOW";

    private LikeButton = (id: string) => new MessageButton()
    .setStyle(3)
    .setCustomId(id)
    .setEmoji('👍');

    private DislikeButton = (id: string) => new MessageButton()
    .setStyle(4)
    .setCustomId(id)
    .setLabel('👎');

    private NextButton = (id: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('▶️');

    private PreviusButton = (id: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('◀️');

    private GuildProfileButton = (disabled: boolean, id?: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id ?? "none")
    .setDisabled(!id || disabled)
    .setLabel('Guild Profile');

    private GlobalProfileButton = (disabled: boolean, id?: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id ?? "none")
    .setDisabled(!id || disabled)
    .setLabel('Global Profile');

    public Profiles = (guildShown: boolean, playerId: string, guildId?: string) => new MessageActionRow()
    .addComponents(this.GuildProfileButton(guildShown, guildId ? `guildprofile.${playerId}` : undefined), this.GlobalProfileButton(!guildShown, `globalprofile.${playerId}`), this.LikeButton(`likePlayer.${playerId}`), this.DislikeButton(`dislikePlayer.${playerId}`));

    public ListMessage = (prevId: string, nextId: string) => new MessageActionRow()
    .addComponents(this.PreviusButton(prevId), this.NextButton(nextId));
    
    public HostCommend = (likeId: string, dislikeId: string) => new MessageActionRow()
    .addComponents(this.LikeButton(likeId), this.DislikeButton(dislikeId));

    public InviteMessage(inviteUrl: string, guild: string) {
        const button = new MessageButton()
        .setStyle('LINK')
        .setLabel(guild)
        .setURL(inviteUrl);
        const row = new MessageActionRow()
        .addComponents(button);
        return row;
    }

    public startedOccasion = new MessageEmbed()
    .setTitle("Event started!")
    .setFooter("Notification will be automatically posted to the notification channel.")
    .setColor(this.infoColor);

    public finishedOccasion = new MessageEmbed()
    .setTitle("Event finished!")
    .setFooter("Don't forget to commend host. The room will be deleted 5 seconds later.")
    .setColor(this.infoColor);

    public voting = (limit: number) => new MessageEmbed()
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
    .addField("What happens when host leave the voice channel?", 
    `Host will keep his permissions even if he leave a voice channel. 
    He will lose all permissions when event finishes. 
    Event will be forced to finish if the host will stay alone in the channel for too long or there will be no people at the channel.`)
    .setColor("WHITE");

    public voteConfimation = (candidate: string) => new MessageEmbed()
    .addField("Information", `Vote for ${candidate} was confirmed.`)
    .setFooter("We let you know when the election will be finished.")
    .setColor(this.confirmColor);

    public electionFinished = (winnerId: string) => new MessageEmbed()
    .setTitle("The election is over!")
    .addField(`Welcome your new host - <@!${winnerId}>`, "Since that moment he's responsible for **everything** that happens in this channel.")
    .addField("How a host should act?", 
    `When everyone is ready you have to start an event \`/host start\`. 
    When party is over don't forget to finish it \`/host finish\`, otherwise, the event won't be scored and players' statistics as well as the host's will **not** be changed.`)
    .addField("We need more people to participate", 
    `Host can use \`/host announce\` command or message's application menu to create announce about your activity!
    Remember, you can use tags in the event description to notify subscribed users across the discord about the event.
    Example: \`/host announce title:My cool party description:We gonna play #Uno #Alias and much more \`
    To prevent spam abuse the command has a cooldown time, use it carefully.`)
    .addField("How can I get notifications?", `All you need is subscribe for events you want to participate.
    Use \`/system subscribe\` to add a new tag to your subscriptions \`/system subscriptions\`. You don't need to pass \`#\` symbol!
    Example: \`/system subscribe tag:Uno\`
    `)
    .setColor(this.infoColor);

    public occasionNotification = (name: string | undefined, description: string, host: string, image: string | undefined) => new MessageEmbed()
    .setTitle(name ?? "New occasion is about to start!")
    .setDescription(description)
    .setFooter(`announce by ${host}`)
    .setImage(image ?? defaultImageUrl)
    .setColor(this.infoColor);

    public occasionStarted = (title: string, description: string, hostName: string, members: number) => new MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when started:", members.toString())
    .setColor(this.infoColor);

    public occasionFinished = (title: string, description: string, hostName: string, minutes: number, members: number) => new MessageEmbed()
    .setTitle(`Event finished`)
    .addField("Title:", title)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when finished:", members.toString())
    .addField("Minutes played:", minutes.toString())
    .setColor(this.infoColor);
    
    public occasionStartResponse = (title: string, description: string) => new MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .setColor(this.confirmColor);

    public occasionFinishResponse = (title: string, time: number) => new MessageEmbed()
    .setTitle(`Event ${title} finished`)
    .addField("Lasted for",`${time} minutes`)
    .setColor(this.confirmColor);

    public announcePublishedResponse(tags: string[]){
        const embed = new MessageEmbed()
        .setTitle(`Announce published`)
        .setColor(this.confirmColor);
        if(tags.length > 0)
            embed.addField("Users with these tags will be notified:", tags.join('\n'))
        else
            embed.setDescription("No Event tags detected. To use them, write #YOUR_TAG anywhere in your message.")
        return embed;
    }

    public notification(title: string, description: string, url: string, banner: string | undefined){
        const embed = new MessageEmbed()
        .setTitle(`${title} is about to start.`)
        .setDescription(description)
        .setURL(url)
        .setColor(this.infoColor);
        if(banner) embed.setThumbnail(banner);
        return embed;
    }

    //Rework timezone
    public playerInfo (player: Player, user: User, commends: Commend[]) { 
        const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
        const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
        const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
        const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
        
        const embed =  new MessageEmbed()
        .setTitle(user.username)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .addField("Events played:", player.eventsPlayed.toString(), true)
        .addField("Events hosted:", player.eventsHosted.toString(), true)
        .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
        .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`, true)
        .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`, true)
        .addField("Global score:", player.score.toString())
        .addField("First event:", player.joinedAt.toLocaleDateString())
        .setColor(this.infoColor);
        if(player.banned > 0) embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`)
        return embed;
    }
    public memberProfile(member: GuildMember, user: User ){
        const embed =  new MessageEmbed()
        .setAuthor(`<@!${member.id}>`)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .addField("Events played: ", member.eventsPlayed.toString(), true)
        .addField("Events hosted: ", member.eventsHosted.toString(), true)
        .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
        .addField("Guild score: ", member.score.toString())
        .addField("First participation: ", member.joinedAt.toLocaleDateString())
        .setColor(this.infoColor);
        if(member.banned) embed.addField(`❌ Warning ❌`, `This user is prevented from joining events on this server.`)
        return embed;
    }
    public playerCommended = (user: User) => new MessageEmbed()
    .setTitle(`${user.username}'s rating changed`)
    .setFooter("Thank you for improving our community.")
    .setColor("GREEN");

    public hostCommended = () => new MessageEmbed()
    .setTitle("Host's rating changed")
    .setFooter("Thank you for improving our community.")
    .setColor(this.confirmColor);

    public addedToBlackList = (user: string) => new MessageEmbed()
    .setTitle("User added to event blacklist!")
    .setDescription(`Since that moment <@!${user}> can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor(this.confirmColor);

    public removedFromBlackList = (user: string) => new MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment <@!${user}> can participate any events in this server and nomimated as host.`)
    .setColor(this.confirmColor);

    public ownerAdded = (username: string) => new MessageEmbed()
    .setTitle("User's permissions increased!")
    .addField("Congratulations!", `Since that moment ${username} has access to all commands of the bot.`)
    .addField("Prescription", "However, **only** server owner can edit owners list.")
    .setColor(this.confirmColor);

    public ownerRemoved = (username: string) => new MessageEmbed()
    .setTitle("User's permission denied!")
    .addField("Guild member was removed from owners list", `Since that moment ${username} has limited access to bot commands.`)
    .setColor("RED");

    public limitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Minimum amount of members to start an event was changed to ${limit}`)
    .setColor(this.confirmColor);

    public occasionLimitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Maximum amount of events at the same time is limited to ${limit}`)
    .setColor(this.confirmColor);

    public unsubscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} was successfuly removed from subscriptions`)
    .setDescription("You won't receive notifications about this type of events.")
    .setColor(this.confirmColor);

    public subscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} successfuly added to personal subscribtions.`)
    .setDescription("Bot will send you notification about this type of events.")
    .setColor(this.confirmColor);
    
    public logRiggedUp = (channel: string) => new MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for logging.`)
    .setDescription("All information about events will be published in this channel.")
    .setColor(this.confirmColor);
    
    public notificationRoleAccepted = (role: string) => new MessageEmbed()
    .setTitle(`Role ${role} accepted as notification role.`)
    .setDescription("Bot will mention it in announcement messages.")
    .setColor(this.confirmColor);

    public notificationChannelRiggedUp = (channel: string) => new MessageEmbed()
    .setTitle(`Channel ${channel} successfuly set for notifications.`)
    .setDescription("Bot will publish announcments about current events there.")
    .setColor(this.confirmColor);
    
    public occasionsRiggedUp = (channel: string, category: string) => new MessageEmbed()
    .setTitle(`Bot environment successfuly established.`)
    .setDescription(`Bot will create voice and text channels in ${category} category every time someone joins ${channel} channel.`)
    .setColor(this.confirmColor);
    
    public errorInformation = (error: string, message: string, stack?: string) => new MessageEmbed()
    .addField(stack ? "Unexpected Error" : error, stack ? "Congratulations, you've found a bug, please contact with support and describe the situation." : message)
    .setFooter("Use help command for detailes.")
    .setColor(this.errorColor);

    public greeting = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("I will start my job right after you set me up.")
    .addField("Information", `Dear, ${owner}, thank you for inviting me to ${guild}`)
    .addField("Setting up", 
    `First of all players need a room to play. 
    Use command \`/owner setup\` to select category where bot will create voice and text channels for players and voice channel where people will join to initiate an event.
    That's all you need to help guild members organize their own events!`)
    .addField("Useful commands", 
    ` Commmands in \`/owner\` section are the ones only server owner can use.
    They allow you to change bot settings such as amount of current events, minimum votes for host election, log channel, channel for announces, role to mention in announces etc.
    Also, you can give someone administrator rights - \`/owner setadmin\`.
    Administrator has permission to block members from playing events (hosts have permission to open channel for blocked users) or unblock them.
    Blocked users have a special badge in profile and receive less rank points from playing events even on other servers.`)
    .setColor(this.infoColor);

    public farawell = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("Information about guild will be removed from our database.")
    .addField("Information", `Dear, ${owner}, thank you for using our service in ${guild}`)
    .setFooter("Please, send us a letter to let us know why you decided to stop using our service. We will make neccessary improvements.")
    .setColor(this.infoColor);
}