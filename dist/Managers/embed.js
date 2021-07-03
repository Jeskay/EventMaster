"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedManager = void 0;
const discord_js_1 = require("discord.js");
class EmbedManager {
    constructor() {
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
        this.addedToBlackList = (user) => new discord_js_1.MessageEmbed()
            .setTitle("User added to event blacklist!")
            .addField("Guild member was blacklisted in your server.", `Since that moment ${user} can't host or participate events in your server.`)
            .addField("Special prescription", "Even though, host **can allow** users from blacklist join an occasion.\n Blacklisted users can't be hosts in any case.")
            .setColor("RED");
        this.removedFromBlackList = (user) => new discord_js_1.MessageEmbed()
            .setTitle("User removed from blacklist!")
            .addField("Congratulations!", `Since that moment ${user} can participate any events in this server and nomimated as host.`)
            .setColor("GREEN");
        this.errorInformation = (error) => new discord_js_1.MessageEmbed()
            .addField("Error:", error)
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
}
exports.EmbedManager = EmbedManager;
