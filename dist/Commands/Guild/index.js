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
exports.guildRating = exports.blackList = exports.guildProfile = exports.finish = exports.start = exports.announce = void 0;
const discord_js_1 = require("discord.js");
const Error_1 = require("../../Error");
const Utils_1 = require("../../Utils");
function announce(client, author, guild, description, title, image) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.announce(client, description, guild, author, title, image);
    });
}
exports.announce = announce;
function start(client, author, guild, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.start(client, guild, author, title, description);
    });
}
exports.start = start;
function finish(client, author, guild, results) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.finish(client, guild, author, results);
    });
}
exports.finish = finish;
function guildProfile(client, guildUser, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const member = yield client.database.getMember(guild.id, guildUser.id);
        const row = client.embeds.Profiles(true, guildUser.id, guild.id);
        const embed = client.embeds.memberProfile(member, guildUser instanceof discord_js_1.User ? guildUser : guildUser.user);
        return { embeds: [embed], components: [row], ephemeral: true };
    });
}
exports.guildProfile = guildProfile;
function blackList(client, channel, author, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.DataBaseError("Server is not registered");
        const embed = (0, Utils_1.blackmembersList)(server.settings.black_list);
        const blacklistId = `blacklist${author.id}`;
        if (client.lists.get(blacklistId))
            client.lists.delete(blacklistId);
        const list = new Utils_1.List(30, embed, 10);
        client.lists.set(blacklistId, list);
        const prevId = `previousPage.${author.id} ${blacklistId}`;
        const nextId = `nextPage.${author.id} ${blacklistId}`;
        list.create(channel, client.embeds.ListMessage(prevId, nextId));
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
        const list = new Utils_1.List(30, (0, Utils_1.ratingList)(rating), 10);
        client.lists.set(rateId, list);
        const prevId = `previousPage.${author.id} ${rateId}`;
        const nextId = `nextPage.${author.id} ${rateId}`;
        list.create(interaction, client.embeds.ListMessage(prevId, nextId));
    });
}
exports.guildRating = guildRating;
