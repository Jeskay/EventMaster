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
