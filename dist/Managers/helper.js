"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperManager = void 0;
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
        console.log(input);
        const extracted = input.substr(2, input.length - 3);
        console.log(extracted);
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
}
exports.HelperManager = HelperManager;
