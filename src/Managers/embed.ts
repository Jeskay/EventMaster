import { MessageEmbed } from "discord.js";

export class EmbedManager{
    public voting = new MessageEmbed()
    .setTitle("Time for the election!")
    .addField("Candidates", "")
    .setFooter("Use **.vote** command to vote for someone.");

}