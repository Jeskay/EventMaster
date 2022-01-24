import { User, MessageEmbed } from "discord.js";
import { Commend } from "src/entities/commend";
import { GuildMember } from "src/entities/member";
import { Player } from "src/entities/player";
import { infoColor } from ".";

export function playerInfo (player: Player, user: User, commends: Commend[]) { 
    const playerLikes = commends.filter(commend => commend.cheer && !commend.host).length;
    const playerDislikes = commends.filter(commend => !commend.cheer && !commend.host).length;
    const hostLikes = commends.filter(commend => commend.cheer && commend.host).length;
    const hostDislikes = commends.filter(commend => !commend.cheer && commend.host).length;
    
    const embed =  new MessageEmbed()
    .setAuthor({name: user.username, iconURL: user.avatarURL() ?? user.defaultAvatarURL})
    .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
    .addField("Events played:", player.eventsPlayed.toString(), true)
    .addField("Events hosted:", player.eventsHosted.toString(), true)
    .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
    .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`, true)
    .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`, true)
    .addField("Global score:", player.score ? player.score.toString() : "0")
    .addField("First event:", `<t:${Math.round(player.joinedAt.getTime() / 1000)}>`)
    .setColor(infoColor);
    if(player.banned > 0) embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`)
    return embed;
}
export function memberProfile(member: GuildMember, user: User ){
    const embed =  new MessageEmbed()
    .setAuthor({name: user.username, iconURL: user.avatarURL() ?? user.defaultAvatarURL})
    .setDescription(`<@!${member.id}>`)
    .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
    .addField("Events played: ", member.eventsPlayed.toString(), true)
    .addField("Events hosted: ", member.eventsHosted.toString(), true)
    .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
    .addField("Guild score: ", member.score ? member.score.toString() : "0")
    .addField("First participation: ", `<t:${Math.round(member.joinedAt.getTime() / 1000)}>`)
    .setColor(infoColor);
    if(member.banned) embed.addField(`❌ Warning ❌`, `This user is prevented from joining events on this server.`)
    return embed;
}