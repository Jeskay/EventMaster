import { ApplicationCommandOption, CategoryChannel, Channel, Guild, MessageEmbed, VoiceChannel } from "discord.js";
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from "@discordjs/builders";
import { Tag } from "../entities/tag";
import ExtendedClient from "../Client";
import { Player } from "../entities/player";
import { GuildMember } from "../entities/member";
import { Commend } from "../entities/commend";
import { DataBaseError } from "../Error";

    /**
     * Resolves when given channel is located in category and guild
     * @returns given channels
     */
    export async function getRelatedChannels(channelID: string, categoryID: string, guild: Guild) {
        const channel = await guild.channels.fetch(channelID);
        const category = await guild.channels.fetch(categoryID);
        if(!channel) throw Error("Cannot find the channel.");
        if(!category) throw Error("Cannot find the category.");
        if(!(channel instanceof VoiceChannel && category instanceof CategoryChannel)) throw Error("Invalid channel types.");
            if(!category.children.has(channel.id)) throw Error(`Channel ${channel.name} is not in ${category.name}.`);
        return {voice: channel, category: category};
    }
    /**
     * extracts ID from link
     * @param input link without extra characters
     * @returns id
     */
    export function extractID(input: string){
        const extracted = input.substr(3, input.length - 4);
        return extracted;
    }
    /**
     * @param member1 first member of the channel
     * @param member2 second member of the channel
     * @param channel channel to check
     * @returns true if the channel contains given members
     */
    export function checkChannel(member1 : string, member2: string, channel: Channel): boolean{
        if(channel.type != "GUILD_VOICE") return false;
        if(!(channel as VoiceChannel).members.has(member1)) return false;
        if(!(channel as VoiceChannel).members.has(member2)) return false;
        return true;
    }
    /**
     * Creates a list of existing commands
     * @param client client instance
     * @returns array of lines to be printed
     */
    export function commandsList(client: ExtendedClient): MessageEmbed {
        const embed = new MessageEmbed()
        .setTitle("Commands");
        client.commands.forEach(command => {
            var options: string = "";
            var line = "";
            if(command.options) options = Array.from(command.options, option => `${option.name}`).join(' ') + '\n';
            line += `${options}${command.description ?? "no description"}`;
            if(command.aliases) line += "\nAliases:" + command.aliases.join(', ');
            embed.addField(command.name, line);
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
        .setTitle("Active users rating");
        players.forEach((player: Player | GuildMember, index: number) => {
            if(player instanceof Player)
            embed.addField(`Tier ${index + 1}`, 
            `id: ${player.id}
            rank: ${player.score}
            commended by ${player.commendsAbout.length} players
            minutes played: ${player.minutesPlayed}
            `
            );
            else
            embed.addField(`Guild tier ${index + 1}`,
            `username: <@!${player.id}>
            rank:${player.score}
            minutes played in guild: ${player.minutesPlayed}
            joined guild: ${player.joinedAt.toLocaleDateString()}
            `);
        });
        return embed;
    }
    export function blackmembersList(players: string[]){
        var embed = new MessageEmbed()
        .setTitle("Players prevented from joining occasions")
        players.forEach((playerId, index) => embed.addField(`${index + 1}.`, `<@!${playerId}>`, true));
        return embed;
    }
    /**
     * Search for tags in string
     * @param text string to search from
     * @returns array of subscription tags
     */
    export function findSubscriptions(text: string) {
        const matches = text.match('#(.*?) ') ?? [];
        return matches as Array<string>;
    }
    /**
     * Formula for player score
     * @returns score
     */
    export function calculateScore(player: Player | GuildMember) {
        let commends: Commend[];
        if(player instanceof Player)
            commends = player.commendsAbout;
        else commends = player.player.commendsAbout;
        const likesHost = commends.filter(commend => commend.cheer && commend.host).length;
        const likesPlayer = commends.filter(commend => commend.cheer && !commend.host).length;
        const dislikesHost = commends.filter(commend => !commend.cheer && commend.host).length;
        const dislikePlayer = commends.filter(commend => !commend.cheer && !commend.host).length;
        const hostScore = likesHost / (dislikesHost + 1) * 1.5 * player.eventsHosted;
        const playerScore = likesPlayer / (dislikePlayer + 1) * player.eventsPlayed;
        return Math.round((hostScore + playerScore) * Math.log10(player.minutesPlayed));
    }
    /**
     * Adds option to slashCommand
     */
    export function createOption(interact_option: ApplicationCommandOption, slashCommand: SlashCommandBuilder): SlashCommandBuilder;
    /**
     * Adds option to subCommand
     */
    export function createOption(interact_option: ApplicationCommandOption, slashCommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder;
    
    export function createOption(interact_option: ApplicationCommandOption, slashCommand: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
        const setOption = (option: any) => 
            option.setName(interact_option.name)
            .setDescription(interact_option.description)
            .setRequired(interact_option.required ?? false);
        
        switch (interact_option.type) {
            case "USER":
                slashCommand.addUserOption(setOption);
                break;
            case "STRING":
                slashCommand.addStringOption(setOption);
                break;
            case "INTEGER":
                slashCommand.addIntegerOption(setOption);
                break;
            case "CHANNEL":
                slashCommand.addChannelOption(setOption);
                break;
            case "NUMBER":
                slashCommand.addIntegerOption(setOption);
                break;
            case "ROLE":
                slashCommand.addRoleOption(setOption);
                break;
            case "MENTIONABLE":
                slashCommand.addMentionableOption(setOption);
                break;
            default:
                break;
        }
        return slashCommand;
    }