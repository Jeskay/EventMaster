"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.guildRating = exports.blackList = exports.guildProfile = exports.finish = exports.start = exports.announce = void 0;
const discord_js_1 = require("discord.js");
const Error_1 = require("../../Error");
const Utils_1 = require("../../Utils");
const Controller = __importStar(require("../../Controllers"));
const Embeds_1 = require("../../Embeds");
function announce(client, author, guild, description, title, image) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Controller.announce(client, description, guild, author, title, image);
    });
}
exports.announce = announce;
function start(client, author, guild, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Controller.start(client, guild, author, title, description);
    });
}
exports.start = start;
function finish(client, author, guild, results) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Controller.finish(client, guild, author, results);
    });
}
exports.finish = finish;
function guildProfile(client, guildUser, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const member = yield client.database.getMember(guild.id, guildUser.id);
        const row = (0, Embeds_1.Profiles)(true, guildUser.id, guild.id);
        const embed = (0, Embeds_1.memberProfile)(member, guildUser instanceof discord_js_1.User ? guildUser : guildUser.user);
        return { embeds: [embed], components: [row], ephemeral: true };
    });
}
exports.guildProfile = guildProfile;
function blackList(client, channel, author, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.DataBaseError("Server is not registered");
        const embed = (0, Embeds_1.blackmembersList)(server.settings.black_list);
        const blacklistId = `blacklist${author.id}`;
        if (client.lists.get(blacklistId))
            client.lists.delete(blacklistId);
        const list = new Utils_1.List(30, embed, 10);
        client.lists.set(blacklistId, list);
        const prevId = `previousPage.${author.id} ${blacklistId}`;
        const nextId = `nextPage.${author.id} ${blacklistId}`;
        list.create(channel, (0, Embeds_1.ListMessage)(prevId, nextId));
    });
}
exports.blackList = blackList;
function guildRating(client, author, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.guildId)
            throw new Error_1.CommandError("Available only in guild channels.");
        const rating = yield client.database.getRanking(interaction.guildId);
        const rateId = `guildrate${author.id}`;
        if (client.lists.get(rateId))
            client.lists.delete(rateId);
        const list = new Utils_1.List(30, (0, Embeds_1.ratingList)(rating), 10);
        client.lists.set(rateId, list);
        const prevId = `previousPage.${author.id} ${rateId}`;
        const nextId = `nextPage.${author.id} ${rateId}`;
        list.create(interaction, (0, Embeds_1.ListMessage)(prevId, nextId));
    });
}
exports.guildRating = guildRating;
