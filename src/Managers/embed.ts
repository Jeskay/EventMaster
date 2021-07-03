import { MessageEmbed } from "discord.js";

export class EmbedManager{
    
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

    public addedToBlackList = (user: string) => new MessageEmbed()
    .setTitle("User added to event blacklist!")
    .addField("Guild member was blacklisted in your server.", `Since that moment ${user} can't host or participate events in your server.`)
    .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
    .setColor("RED");

    public removedFromBlackList = (user: string) => new MessageEmbed()
    .setTitle("User removed from blacklist!")
    .addField("Congratulations!", `Since that moment ${user} can participate any events in this server and nomimated as host.`)
    .setColor("GREEN");

    public errorInformation = (error: string) => new MessageEmbed()
    .addField("Error:", error)
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