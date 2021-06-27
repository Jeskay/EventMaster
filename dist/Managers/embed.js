"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedManager = void 0;
const discord_js_1 = require("discord.js");
class EmbedManager {
    constructor() {
        this.voting = new discord_js_1.MessageEmbed()
            .setTitle("Time for the election!")
            .addField("Candidates", "")
            .setFooter("Use **.vote** command to vote for someone.");
    }
}
exports.EmbedManager = EmbedManager;
