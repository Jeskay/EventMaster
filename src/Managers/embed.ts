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