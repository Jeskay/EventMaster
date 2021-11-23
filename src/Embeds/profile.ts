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
    .setTitle(user.username)
    .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
    .addField("Events played:", player.eventsPlayed.toString(), true)
    .addField("Events hosted:", player.eventsHosted.toString(), true)
    .addField("Time spent in occasions:", `${player.minutesPlayed} minutes`)
    .addField("Player stats:", `${playerLikes} 👍   ${playerDislikes} 👎`, true)
    .addField("Host stats:", `${hostLikes} 👍   ${hostDislikes} 👎`, true)
    .addField("Global score:", player.score.toString())
    .addField("First event:", `<t:${player.joinedAt.getTime() / 1000}>`)
    .setColor(infoColor);
    if(player.banned > 0) embed.addField(`❌ Warning ❌`, `In blacklist of ${player.banned} servers.`)
    return embed;
}
export function memberProfile(member: GuildMember, user: User ){
    const embed =  new MessageEmbed()
    .setAuthor(`<@!${member.id}>`)
    .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
    .addField("Events played: ", member.eventsPlayed.toString(), true)
    .addField("Events hosted: ", member.eventsHosted.toString(), true)
    .addField("Time spent in occasions: ", `${member.minutesPlayed.toString()} minutes`)
    .addField("Guild score: ", member.score.toString())
    .addField("First participation: ", `<t:${member.joinedAt.getTime() / 1000}>`)
    .setColor(infoColor);
    if(member.banned) embed.addField(`❌ Warning ❌`, `This user is prevented from joining events on this server.`)
    return embed;
}