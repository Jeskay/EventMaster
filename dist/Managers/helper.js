"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperManager = void 0;
class HelperManager {
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
