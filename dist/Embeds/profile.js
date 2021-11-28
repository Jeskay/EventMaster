"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberProfile = exports.playerInfo = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
function playerInfo(player, user, commends) {
    var _a;
    const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
    const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
    const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
    const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(user.username)
        .setThumbnail((_a = user.avatarURL()) !== null && _a !== void 0 ? _a : user.defaultAvatarURL)
        .addField("Events played:", player.eventsPlayed.toString(), true)
        .addField("Events hosted:", player.eventsHosted.toString(), true)
        .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
        .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`, true)
        .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`, true)
        .addField("Global score:", player.score.toString())
        .addField("First event:", `<t:${player.joinedAt.getTime() / 1000}>`)
        .setColor(_1.infoColor);
    if (player.banned > 0)
        embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`);
    return embed;
}
exports.playerInfo = playerInfo;
function memberProfile(member, user) {
    var _a;
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`<@!${member.id}>`)
        .setThumbnail((_a = user.avatarURL()) !== null && _a !== void 0 ? _a : user.defaultAvatarURL)
        .addField("Events played: ", member.eventsPlayed.toString(), true)
        .addField("Events hosted: ", member.eventsHosted.toString(), true)
        .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
        .addField("Guild score: ", member.score.toString())
        .addField("First participation: ", `<t:${member.joinedAt.getTime() / 1000}>`)
        .setColor(_1.infoColor);
    if (member.banned)
        embed.addField(`❌ Warning ❌`, `This user is prevented from joining events on this server.`);
    return embed;
}
exports.memberProfile = memberProfile;
