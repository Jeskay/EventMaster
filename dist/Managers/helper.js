"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperManager = void 0;
const discord_js_1 = require("discord.js");
class HelperManager {
    validatePair(channelID, categoryID, guild) {
        const channel = guild.channels.cache.get(channelID);
        const category = guild.channels.cache.get(categoryID);
        if (!channel)
            throw Error("Cannot find the channel.");
        if (!category)
            throw Error("Cannot find the category.");
        if (!category.children.has(channelID))
            throw Error(`Channel ${channel.name} is not in ${category.name}.`);
    }
    extractID(input) {
        const extracted = input.substr(3, input.length - 4);
        return extracted;
    }
    checkChannel(member1, member2, channel) {
        if (channel.type != "voice")
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
            if (command.options)
                options = Array.from(command.options, option => `${option.name} (${option.required ? "required" : "not required"})`).join(' ') + '\n';
            embed.addField(command.name, `${options}${(_a = command.description) !== null && _a !== void 0 ? _a : "no description"}`);
            if (command.aliases)
                embed.addField("Aliases:", command.aliases.join(', '));
        });
        return embed;
    }
}
exports.HelperManager = HelperManager;
