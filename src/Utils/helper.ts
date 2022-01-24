import { AnyChannel, CategoryChannel, Guild, VoiceChannel } from "discord.js";
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from "@discordjs/builders";
import { Player } from "../entities/player";
import { GuildMember } from "../entities/member";
import { Commend } from "../entities/commend";
import { InteractCommandOption } from "../Interfaces/Command";

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
        const extracted = input.substring(3, input.length - 3);
        return extracted;
    }
    /**
     * @param member1 first member of the channel
     * @param member2 second member of the channel
     * @param channel channel to check
     * @returns true if the channel contains given members
     */
    export function checkChannel(member1 : string, member2: string, channel: AnyChannel): boolean{
        if(channel.type != "GUILD_VOICE") return false;
        if(!(channel as VoiceChannel).members.has(member1)) return false;
        if(!(channel as VoiceChannel).members.has(member2)) return false;
        return true;
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
        const score = Math.round((hostScore + playerScore) * Math.log10(player.minutesPlayed));
        return Number.isInteger(score) ? score : 0;
    }
    /**
     * Adds option to slashCommand
     */
    export function createOption(interact_option: InteractCommandOption, slashCommand: SlashCommandBuilder): SlashCommandBuilder;
    /**
     * Adds option to subCommand
     */
    export function createOption(interact_option: InteractCommandOption, slashCommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder;
    
    export function createOption(interact_option: InteractCommandOption, slashCommand: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
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