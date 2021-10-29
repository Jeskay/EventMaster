import { User, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { GuildMember } from "src/entities/member";
import { Commend } from "../entities/commend";
import { Player } from "../entities/player";
const defaultImageUrl = "https://i.pinimg.com/564x/7c/73/c2/7c73c263484564935023c892801d393c.jpg";

export class EmbedManager{
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
    .setColor("WHITE");

    public finishedOccasion = new MessageEmbed()
    .setTitle("Event finished!")
    .setFooter("Don't forget to commend host. The room will be deleted 5 seconds later.")
    .setColor("WHITE");

    public voting = new MessageEmbed()
    .setTitle("Time for the election!")
    .setFooter("Use **.vote** command to vote for the host.")
    .setColor("WHITE");

    public voteConfimation = (candidate: string) => new MessageEmbed()
    .addField("Information", `Vote for ${candidate} was confirmed.`)
    .setFooter("We let you know when the election will be finished.")
    .setColor("GREEN");

    public electionFinished = (winner: string) => new MessageEmbed()
    .setTitle("The election is over!")
    .addField(`Welcome your new host - ${winner}`, "Since that moment he's responsible for **everything** that happens in this channel.")
    .setFooter("Don't forget to rate your host after the game.")
    .setColor("PURPLE");

    public occasionNotification = (name: string | undefined, description: string, host: string, image: string | undefined) => new MessageEmbed()
    .setTitle(name ?? "New occasion is about to start!")
    .setDescription(description)
    .setFooter(`announce by ${host}`)
    .setImage(image ?? defaultImageUrl)
    .setColor("PURPLE");

    public occasionStarted = (title: string, description: string, hostName: string, members: number) => new MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when started:", members.toString())
    .setColor("PURPLE");

    public occasionFinished = (title: string, description: string, hostName: string, minutes: number, members: number) => new MessageEmbed()
    .setTitle(`Event finished`)
    .addField("Title:", title)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when finished:", members.toString())
    .addField("Minutes played:", minutes.toString())
    .setColor("PURPLE");
    
    public occasionStartResponse = (title: string, description: string) => new MessageEmbed()
    .setTitle(`Occasion ${title} started`)
    .setDescription(description)
    .setColor("GREEN");

    public occasionFinishResponse = (title: string, time: number) => new MessageEmbed()
    .setTitle(`Occasion ${title} finished`)
    .addField("Lasted for",`${time} minutes`)
    .setColor("GREEN");

    public announcePublishedResponse(tags: string[]){
        const embed = new MessageEmbed()
        .setTitle(`Announce published`)
        .setColor("GREEN");
        if(tags.length > 0)
            embed.addField("Users with these tags will be notified:", tags.join('\n'))
        else
            embed.setDescription("No occasion tags detected. To use them, write #YOUR_TAG anywhere in your message.")
        return embed;
    }

    public notification(title: string, description: string, url: string, banner: string | undefined){
        const embed = new MessageEmbed()
        .setTitle(`${title} is about to start.`)
        .setDescription(description)
        .setURL(url)
        .setColor("GREEN");
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
        .addField("Events played:", player.eventsPlayed.toString())
        .addField("Events hosted:", player.eventsHosted.toString())
        .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
        .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`)
        .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`)
        .addField("Global score:", player.score.toString())
        .addField("First event:", player.joinedAt.toLocaleDateString())
        .setColor("PURPLE");
        if(player.banned > 0) embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`)
        return embed;
    }
    public memberProfile(member: GuildMember, user: User ){
        const embed =  new MessageEmbed()
        .setAuthor(user.username)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .addField("Member:", `<@!${member.id}>`)
        .addField("Events played: ", member.eventsPlayed.toString())
        .addField("Events hosted: ", member.eventsHosted.toString())
        .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
        .addField("Guild score: ", member.score.toString())
        .addField("First participation: ", member.joinedAt.toLocaleDateString())
        .setColor("DARK_PURPLE");
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
    .setColor("GREEN");

    public addedToBlackList = (user: string) => new MessageEmbed()
    .setTitle("User added to event blacklist!")
    .setDescription(`Since that moment <@!${user}> can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor("RED");

    public removedFromBlackList = (user: string) => new MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment <@!${user}> can participate any events in this server and nomimated as host.`)
    .setColor("GREEN");

    public ownerAdded = (username: string) => new MessageEmbed()
    .setTitle("User's permissions increased!")
    .addField("Congratulations!", `Since that moment ${username} has access to all commands of the bot.`)
    .addField("Prescription", "However, **only** server owner can edit owners list.")
    .setColor("GREEN");

    public ownerRemoved = (username: string) => new MessageEmbed()
    .setTitle("User's permission denied!")
    .addField("Guild member was removed from owners list", `Since that moment ${username} has limited access to bot commands.`)
    .setColor("RED");

    public limitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Minimum amount of members to start an occasion was changed to ${limit}`)
    .setColor("GREEN");

    public occasionLimitChanged = (limit: number) => new MessageEmbed()
    .setTitle("Limit changed successfuly")
    .setDescription(`Maximum amount of occasions at the same time is limited to ${limit}`)
    .setColor("GREEN");

    public unsubscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} was successfuly removed from subscriptions`)
    .setDescription("You won't receive notifications about this type of occasions.")
    .setColor("DARK_GREEN");

    public subscribed = (tag: string) => new MessageEmbed()
    .setTitle(`Tag ${tag} successfuly added to personal subscribtions.`)
    .setDescription("Bot will send you notification about this type of occasions.")
    .setColor("GREEN");
    
    public errorInformation = (error: string, message: string) => new MessageEmbed()
    .addField(error, message)
    .setFooter("Use help command for detailes.")
    .setColor("RED");

    public greeting = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("I will start my job right after you set me up.")
    .addField("Information", `Dear, ${owner}, thank you for inviting me to ${guild}`)
    .setDescription("First of all you need to choose a category and voice channel inside it. Bot will create new occasions when people join this channel.")
    .setColor("WHITE");

    public farawell = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("Information about guild will be removed from our database.")
    .addField("Information", `Dear, ${owner}, thank you for using our service in ${guild}`)
    .setFooter("Please, send us a letter to let us know why you decided to stop using our service. We will make neccessary improvements.")
    .setColor("WHITE");
}