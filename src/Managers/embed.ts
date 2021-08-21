import { User, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { Commend } from "../entities/commend";
import { Player } from "../entities/player";

export class EmbedManager{
    private LikeHost = (id: string) => new MessageButton()
    .setStyle(3)
    .setCustomId(id)
    .setEmoji('👍');

    private DislikeHost = (id: string) => new MessageButton()
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

    public ListMessage = (prevId: string, nextId: string) => new MessageActionRow()
    .addComponents(this.PreviusButton(prevId), this.NextButton(nextId));
    
    public HostCommend = (likeId: string, dislikeId: string) => new MessageActionRow()
    .addComponents(this.LikeHost(likeId), this.DislikeHost(dislikeId));

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

    public occasionNotification = (name: string, description: string, host: string) => new MessageEmbed()
    .setTitle(name)
    .setDescription(description)
    .setFooter(`announce by ${host}`)
    .setColor("PURPLE");

    public occasionStarted = (title: string, description: string, hostName: string, members: number) => new MessageEmbed()
    .setTitle(`Event ${title} started`)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when started:", members.toString())
    .setColor("PURPLE");

    public occasionFinished = (description: string, hostName: string, members: number) => new MessageEmbed()
    .setTitle(`Event finished`)
    .setDescription(description)
    .addField("Host:", hostName)
    .addField("Members when finished:", members.toString())
    .setColor("PURPLE");
    
    public notification = (title: string, description, url: string) => new MessageEmbed()
    .setTitle(`${title} is about to start.`)
    .setDescription(description)
    .setURL(url)
    .setColor("GREEN");

    //Rework timezone
    public playerInfo (player: Player, user: User, commends: Commend[]) { 
        const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
        const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
        const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
        const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
        
        return new MessageEmbed()
        .setTitle(user.username)
        .addField("Events played:", player.eventsPlayed.toString())
        .addField("Events hosted:", player.eventsHosted.toString())
        .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`)
        .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`)
        .addField("First event:", player.joinedAt.toLocaleString())
        .setColor("PURPLE");
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
    .addField("Guild member was blacklisted in your server.", `Since that moment ${user} can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor("RED");

    public removedFromBlackList = (user: string) => new MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment ${user} can participate any events in this server and nomimated as host.`)
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

    public errorInformation = (error: string, message: string) => new MessageEmbed()
    .addField(error, message)
    .setFooter("Use help command for detailes.")
    .setColor("RED");

    public greeting = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("I will start my job right after you set me up.")
    .addField("Information", `Dear, ${owner}, thank you for inviting me to ${guild}`)
    .setFooter("Use help command for detailes.")
    .setColor("WHITE");

    public farawell = (guild: string, owner: string) => new MessageEmbed()
    .setTitle("Information about guild will be removed from our database.")
    .addField("Information", `Dear, ${owner}, thank you for using our service in ${guild}`)
    .setFooter("Please, send us a letter to let us know why you decided to stop using our service. We will make neccessary improvements.")
    .setColor("WHITE");
}