"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberProfile = exports.playerInfo = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
function playerInfo(player, user, commends) {
    var _a, _b;
    const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
    const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
    const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
    const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor({ name: user.username, iconURL: (_a = user.avatarURL()) !== null && _a !== void 0 ? _a : user.defaultAvatarURL })
        .setThumbnail((_b = user.avatarURL()) !== null && _b !== void 0 ? _b : user.defaultAvatarURL)
        .addField("Events played:", player.eventsPlayed.toString(), true)
        .addField("Events hosted:", player.eventsHosted.toString(), true)
        .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
        .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`, true)
        .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`, true)
        .addField("Global score:", player.score ? player.score.toString() : "0")
        .addField("First event:", `<t:${Math.round(player.joinedAt.getTime() / 1000)}>`)
        .setColor(_1.infoColor);
    if (player.banned > 0)
        embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`);
    return embed;
}
exports.playerInfo = playerInfo;
function memberProfile(member, user) {
    var _a, _b;
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor({ name: user.username, iconURL: (_a = user.avatarURL()) !== null && _a !== void 0 ? _a : user.defaultAvatarURL })
        .setDescription(`<@!${member.id}>`)
        .setThumbnail((_b = user.avatarURL()) !== null && _b !== void 0 ? _b : user.defaultAvatarURL)
        .addField("Events played: ", member.eventsPlayed.toString(), true)
        .addField("Events hosted: ", member.eventsHosted.toString(), true)
        .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
        .addField("Guild score: ", member.score ? member.score.toString() : "0")
        .addField("First participation: ", `<t:${Math.round(member.joinedAt.getTime() / 1000)}>`)
        .setColor(_1.infoColor);
    if (member.banned)
        embed.addField(`❌ Warning ❌`, `This user is prevented from joining events on this server.`);
    return embed;
}
exports.memberProfile = memberProfile;
