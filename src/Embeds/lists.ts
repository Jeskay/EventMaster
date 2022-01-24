import { MessageEmbed } from "discord.js";
import ExtendedClient from "../Client";
import { Player } from "../entities/player";
import { GuildMember } from "../entities/member"
import { Tag } from "../entities/tag";
import { DataBaseError } from "../Error";

/**
     * Creates a list of existing commands
     * @param client client instance
     * @returns array of lines to be printed
     */
 export function commandsList(client: ExtendedClient): MessageEmbed {
    const embed = new MessageEmbed()
    .setTitle("Commands")
    .setColor("WHITE");
    client.commands.forEach(command => {
        var options: string = Array.from(command.options, option => `${option.name}`).join(' ');
        var line = "";
        if(options.length > 0) options = " `" + options + "`" + '\n';
        line += `> ${command.description ?? "no description"}`;
        if(command.aliases) line += "\n> Aliases: `" + command.aliases.join(', ') + "`";
        embed.addField(client.config.prefix + command.name + options, line);
    });
    return embed;
}
/**
 * Creates a list of subscriptions
 * @param tags subscription tags
 * @returns embed
 */
export function subscriptionList(tags: Tag[]){
    var embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Subscriptions");
    let field = "";
    for(let i = 1;i <= tags.length; i++){
        field += ` \`${tags[i-1].title}\``;
        if(i % 3 == 0) {
            embed.addField(`🔹`, field, true);
            field = "";
        }
    }
    if(field != "") embed.addField(`🔹`, field);
    return embed;
}
/**
 * Creates a rating list
 * @param players array of players to list
 * @returns embed
 */
export function ratingList(players: Player[] | GuildMember[]){
    if(players.length == 0) throw new DataBaseError("Empty list");
    var embed = new MessageEmbed()
    .setColor("GOLD")
    .setTitle("Active users rating");
    players.forEach((player: Player | GuildMember, index: number) => {
        if(player instanceof Player)
        embed.addField(`${index + 1}. ${player.id}`, 
        `rank: ${player.score}
        commended by ${player.commendsAbout.length} players
        minutes played: ${player.minutesPlayed}
        `
        );
        else
        embed.addField(`${index + 1}. <@!${player.id}>`,
        `rank:${player.score}
        minutes played in guild: ${player.minutesPlayed}
        joined guild: ${player.joinedAt.toLocaleDateString()}
        `);
    });
    return embed;
}
export function blackmembersList(players: string[]){
    var embed = new MessageEmbed()
    .setColor("NOT_QUITE_BLACK")
    .setTitle("Players prevented from joining occasions")
    players.forEach((playerId, index) => embed.addField(`${index + 1}.`, `<@!${playerId}>`, true));
    return embed;
}