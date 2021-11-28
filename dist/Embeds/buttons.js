"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostCommend = exports.ListMessage = exports.Profiles = exports.GlobalProfileButton = exports.GuildProfileButton = exports.PreviusButton = exports.NextButton = exports.DislikeButton = exports.LikeButton = void 0;
const discord_js_1 = require("discord.js");
const LikeButton = (id) => new discord_js_1.MessageButton()
    .setStyle(3)
    .setCustomId(id)
    .setEmoji('👍');
exports.LikeButton = LikeButton;
const DislikeButton = (id) => new discord_js_1.MessageButton()
    .setStyle(4)
    .setCustomId(id)
    .setLabel('👎');
exports.DislikeButton = DislikeButton;
const NextButton = (id) => new discord_js_1.MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('▶️');
exports.NextButton = NextButton;
const PreviusButton = (id) => new discord_js_1.MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('◀️');
exports.PreviusButton = PreviusButton;
const GuildProfileButton = (disabled, id) => new discord_js_1.MessageButton()
    .setStyle(1)
    .setCustomId(id !== null && id !== void 0 ? id : "none")
    .setDisabled(!id || disabled)
    .setLabel('Guild Profile');
exports.GuildProfileButton = GuildProfileButton;
const GlobalProfileButton = (disabled, id) => new discord_js_1.MessageButton()
    .setStyle(1)
    .setCustomId(id !== null && id !== void 0 ? id : "none")
    .setDisabled(!id || disabled)
    .setLabel('Global Profile');
exports.GlobalProfileButton = GlobalProfileButton;
const Profiles = (guildShown, playerId, guildId) => new discord_js_1.MessageActionRow()
    .addComponents((0, exports.GuildProfileButton)(guildShown, guildId ? `guildprofile.${playerId}` : undefined), (0, exports.GlobalProfileButton)(!guildShown, `globalprofile.${playerId}`), (0, exports.LikeButton)(`likePlayer.${playerId}`), (0, exports.DislikeButton)(`dislikePlayer.${playerId}`));
exports.Profiles = Profiles;
const ListMessage = (prevId, nextId) => new discord_js_1.MessageActionRow()
    .addComponents((0, exports.PreviusButton)(prevId), (0, exports.NextButton)(nextId));
exports.ListMessage = ListMessage;
const HostCommend = (likeId, dislikeId) => new discord_js_1.MessageActionRow()
    .addComponents((0, exports.LikeButton)(likeId), (0, exports.DislikeButton)(dislikeId));
exports.HostCommend = HostCommend;
