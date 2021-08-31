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
exports.HelperManager = void 0;
const discord_js_1 = require("discord.js");
class HelperManager {
    getRelatedChannels(channelID, categoryID, guild) {
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
    extractID(input) {
        const extracted = input.substr(3, input.length - 4);
        return extracted;
    }
    checkChannel(member1, member2, channel) {
        if (channel.type != "GUILD_VOICE")
            return false;
        if (!channel.members.has(member1))
            return false;
        if (!channel.members.has(member2))
            return false;
        return true;
    }
    commandsList(client) {
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Commands");
        client.commands.forEach(command => {
            var _a;
            var options = "";
            var line = "";
            if (command.options)
                options = Array.from(command.options, option => `${option.name}`).join(' ') + '\n';
            line += `${options}${(_a = command.description) !== null && _a !== void 0 ? _a : "no description"}`;
            if (command.aliases)
                line += "\nAliases:" + command.aliases.join(', ');
            embed.addField(command.name, line);
        });
        return embed;
    }
    subscriptionList(tags) {
        var embed = new discord_js_1.MessageEmbed()
            .setTitle("Subscriptions");
        let field = "";
        for (let i = 1; i <= tags.length; i++) {
            field += ` \`${tags[i - 1].title}\``;
            if (i % 3 == 0) {
                embed.addField(`${i > 2 ? i - 2 : 1}-${i}`, field);
                field = "";
            }
        }
        if (field != "")
            embed.addField(`${tags.length > 3 ? tags.length - 1 : 1}-${tags.length}`, field);
        return embed;
    }
    findSubscriptions(text) {
        var _a;
        const matches = (_a = text.match('#(.*?) ')) !== null && _a !== void 0 ? _a : [];
        return matches;
    }
    createOption(interact_option, slashCommand) {
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
            case "SUB_COMMAND":
                slashCommand.addSubcommand(setOption);
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
}
exports.HelperManager = HelperManager;
