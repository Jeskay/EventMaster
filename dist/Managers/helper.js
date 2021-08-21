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
                options = Array.from(command.options, option => `${option.name} (${option.required ? "required" : "not required"})`).join(' ') + '\n';
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
}
exports.HelperManager = HelperManager;
