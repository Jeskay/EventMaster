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
exports.RoomManger = exports.MemberState = exports.OccasionState = void 0;
const discord_js_1 = require("discord.js");
var OccasionState;
(function (OccasionState) {
    OccasionState[OccasionState["voting"] = 0] = "voting";
    OccasionState[OccasionState["waiting"] = 1] = "waiting";
    OccasionState[OccasionState["playing"] = 2] = "playing";
    OccasionState[OccasionState["finished"] = 3] = "finished";
})(OccasionState = exports.OccasionState || (exports.OccasionState = {}));
var MemberState;
(function (MemberState) {
    MemberState[MemberState["joined"] = 0] = "joined";
    MemberState[MemberState["left"] = 1] = "left";
    MemberState[MemberState["moved"] = 2] = "moved";
    MemberState[MemberState["other"] = 3] = "other";
})(MemberState = exports.MemberState || (exports.MemberState = {}));
class RoomManger {
    channels(guild, text, voice) {
        const voiceChannel = guild.channels.cache.get(voice);
        const textChannel = guild.channels.cache.get(text);
        return { voiceChannel, textChannel };
    }
    create(initiator, category, blacklist) {
        return __awaiter(this, void 0, void 0, function* () {
            let text_permissions = [];
            let voice_permissions = [];
            blacklist.forEach(user => {
                text_permissions.push({
                    type: 'member',
                    id: user,
                    deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.SEND_MESSAGES]
                });
                voice_permissions.push({
                    type: 'member',
                    id: user,
                    deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL, discord_js_1.Permissions.FLAGS.CONNECT]
                });
            });
            const voiceChnl = yield category.guild.channels.create(initiator.username, {
                type: "GUILD_VOICE",
                parent: category,
                permissionOverwrites: voice_permissions
            });
            const textChnl = yield category.guild.channels.create(initiator.username, {
                type: "GUILD_TEXT",
                parent: category,
                rateLimitPerUser: 30,
                permissionOverwrites: text_permissions
            });
            return { voice: voiceChnl, text: textChnl };
        });
    }
    givePermissions(guild, text, voice, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { voiceChannel, textChannel } = this.channels(guild, text, voice);
            yield voiceChannel.permissionOverwrites.edit(user, {
                MANAGE_CHANNELS: true
            });
            yield textChannel.permissionOverwrites.edit(user, {
                MANAGE_CHANNELS: true
            });
        });
    }
    delete(guild, voice, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const { voiceChannel, textChannel } = this.channels(guild, text, voice);
            yield voiceChannel.delete();
            yield textChannel.delete();
        });
    }
    checkState(oldState, newState) {
        if (oldState.channel == newState.channel)
            return MemberState.other;
        if (newState.channel == null)
            return MemberState.left;
        if (oldState.channel == null)
            return MemberState.joined;
        return MemberState.moved;
    }
}
exports.RoomManger = RoomManger;
