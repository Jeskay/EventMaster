"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOption = exports.calculateScore = exports.findSubscriptions = exports.checkChannel = exports.extractID = exports.getRelatedChannels = void 0;
const discord_js_1 = require("discord.js");
const player_1 = require("../entities/player");
function getRelatedChannels(channelID, categoryID, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield guild.channels.fetch(channelID);
        const category = yield guild.channels.fetch(categoryID);
        if (!channel)
            throw Error("Cannot find the channel.");
        if (!category)
            throw Error("Cannot find the category.");
        if (!(channel instanceof discord_js_1.VoiceChannel && category instanceof discord_js_1.CategoryChannel))
            throw Error("Invalid channel types.");
        if (!category.children.has(channel.id))
            throw Error(`Channel ${channel.name} is not in ${category.name}.`);
        return { voice: channel, category: category };
    });
}
exports.getRelatedChannels = getRelatedChannels;
function extractID(input) {
    const extracted = input.substring(3, input.length - 3);
    return extracted;
}
exports.extractID = extractID;
function checkChannel(member1, member2, channel) {
    if (channel.type != "GUILD_VOICE")
        return false;
    if (!channel.members.has(member1))
        return false;
    if (!channel.members.has(member2))
        return false;
    return true;
}
exports.checkChannel = checkChannel;
function findSubscriptions(text) {
    var _a;
    const matches = (_a = text.match('#(.*?) ')) !== null && _a !== void 0 ? _a : [];
    return matches;
}
exports.findSubscriptions = findSubscriptions;
function calculateScore(player) {
    let commends;
    if (player instanceof player_1.Player)
        commends = player.commendsAbout;
    else
        commends = player.player.commendsAbout;
    const likesHost = commends.filter(commend => commend.cheer && commend.host).length;
    const likesPlayer = commends.filter(commend => commend.cheer && !commend.host).length;
    const dislikesHost = commends.filter(commend => !commend.cheer && commend.host).length;
    const dislikePlayer = commends.filter(commend => !commend.cheer && !commend.host).length;
    const hostScore = likesHost / (dislikesHost + 1) * 1.5 * player.eventsHosted;
    const playerScore = likesPlayer / (dislikePlayer + 1) * player.eventsPlayed;
    const score = Math.round((hostScore + playerScore) * Math.log10(player.minutesPlayed));
    return Number.isInteger(score) ? score : 0;
}
exports.calculateScore = calculateScore;
function createOption(interact_option, slashCommand) {
    const setOption = (option) => {
        var _a;
        return option.setName(interact_option.name)
            .setDescription(interact_option.description)
            .setRequired((_a = interact_option.required) !== null && _a !== void 0 ? _a : false);
    };
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
exports.createOption = createOption;
