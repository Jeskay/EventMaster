"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blackmembersList = exports.ratingList = exports.subscriptionList = exports.commandsList = void 0;
const discord_js_1 = require("discord.js");
const player_1 = require("../entities/player");
const Error_1 = require("../Error");
function commandsList(client) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("Commands")
        .setColor("WHITE");
    client.commands.forEach(command => {
        var _a;
        var options = Array.from(command.options, option => `${option.name}`).join(' ');
        var line = "";
        if (options.length > 0)
            options = " `" + options + "`" + '\n';
        line += `> ${(_a = command.description) !== null && _a !== void 0 ? _a : "no description"}`;
        if (command.aliases)
            line += "\n> Aliases: `" + command.aliases.join(', ') + "`";
        embed.addField(client.config.prefix + command.name + options, line);
    });
    return embed;
}
exports.commandsList = commandsList;
function subscriptionList(tags) {
    var embed = new discord_js_1.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Subscriptions");
    let field = "";
    for (let i = 1; i <= tags.length; i++) {
        field += ` \`${tags[i - 1].title}\``;
        if (i % 3 == 0) {
            embed.addField(`🔹`, field, true);
            field = "";
        }
    }
    if (field != "")
        embed.addField(`🔹`, field);
    return embed;
}
exports.subscriptionList = subscriptionList;
function ratingList(players) {
    if (players.length == 0)
        throw new Error_1.DataBaseError("Empty list");
    var embed = new discord_js_1.MessageEmbed()
        .setColor("GOLD")
        .setTitle("Active users rating");
    players.forEach((player, index) => {
        if (player instanceof player_1.Player)
            embed.addField(`${index + 1}. ${player.id}`, `rank: ${player.score}
        commended by ${player.commendsAbout.length} players
        minutes played: ${player.minutesPlayed}
        `);
        else
            embed.addField(`${index + 1}. <@!${player.id}>`, `rank:${player.score}
        minutes played in guild: ${player.minutesPlayed}
        joined guild: ${player.joinedAt.toLocaleDateString()}
        `);
    });
    return embed;
}
exports.ratingList = ratingList;
function blackmembersList(players) {
    var embed = new discord_js_1.MessageEmbed()
        .setColor("NOT_QUITE_BLACK")
        .setTitle("Players prevented from joining occasions");
    players.forEach((playerId, index) => embed.addField(`${index + 1}.`, `<@!${playerId}>`, true));
    return embed;
}
exports.blackmembersList = blackmembersList;
