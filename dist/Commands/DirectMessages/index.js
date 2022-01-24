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
exports.playerRating = exports.vote = exports.subscriptions = exports.unsubscribe = exports.subscribe = exports.profile = exports.help = exports.like = exports.dislike = void 0;
const Utils_1 = require("../../Utils");
const Error_1 = require("../../Error");
const Utils_2 = require("../../Utils");
const Controller = __importStar(require("../../Controllers"));
const Embeds_1 = require("../../Embeds");
function dislike(client, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Controller.dislikePlayer(client, user.id, author.id);
        return (0, Embeds_1.playerCommended)(user);
    });
}
exports.dislike = dislike;
function like(client, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Controller.likePlayer(client, user.id, author.id);
        return (0, Embeds_1.playerCommended)(user);
    });
}
exports.like = like;
function help(client, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const prevId = `previousPage.${author.id} help`;
        const nextId = `nextPage.${author.id} help`;
        const list = client.lists.get('help');
        if (!list)
            throw new Error_1.CommandError('Command list not found.');
        yield list.create(channel, (0, Embeds_1.ListMessage)(prevId, nextId));
    });
}
exports.help = help;
function profile(client, user, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(user.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const row = (0, Embeds_1.Profiles)(guild ? true : false, user.id, guild ? guild.id : undefined);
        const embed = (0, Embeds_1.playerInfo)(profile, user, profile.commendsAbout);
        return { embeds: [embed], components: [row], ephemeral: true };
    });
}
exports.profile = profile;
function subscribe(client, author, title) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(author.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const tags = yield profile.subscriptions;
        if (tags.find(tag => tag.title == title))
            throw new Error_1.CommandError("You are already subscribed for this tag.");
        var tag = (_a = yield client.database.getTag(title)) !== null && _a !== void 0 ? _a : client.database.tag({ title: title });
        yield client.database.addTag(tag);
        tags.push(tag);
        profile.subscriptions = Promise.resolve(tags);
        yield client.database.updatePlayer(profile);
        return (0, Embeds_1.subscribed)(tag.title);
    });
}
exports.subscribe = subscribe;
function unsubscribe(client, author, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(author.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const tags = yield profile.subscriptions;
        if (!tags.find(tag => tag.title == title))
            throw new Error_1.CommandError("You are not subscribed for this tag.");
        yield client.database.removeTag(title);
        return (0, Embeds_1.unsubscribed)(title);
    });
}
exports.unsubscribe = unsubscribe;
function subscriptions(client, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(author.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const subId = `subs${author.id}`;
        if (client.lists.get(subId))
            client.lists.delete(subId);
        const tags = yield profile.subscriptions;
        if (tags.length < 1)
            throw new Error_1.CommandError("You have no subscriptions.");
        const list = new Utils_1.List(30, (0, Embeds_1.subscriptionList)(tags), 5);
        client.lists.set(subId, list);
        const prevId = `previousPage.${author.id} ${subId}`;
        const nextId = `nextPage.${author.id} ${subId}`;
        list.create(channel, (0, Embeds_1.ListMessage)(prevId, nextId));
    });
}
exports.subscriptions = subscriptions;
function vote(client, author, candidate) {
    return __awaiter(this, void 0, void 0, function* () {
        if (author.id == candidate.id)
            throw new Error_1.CommandError("You can't vote for yourself.");
        const voiceChannel = client.channels.cache.find(channel => (0, Utils_2.checkChannel)(author.id, candidate.id, channel));
        if (!voiceChannel)
            throw new Error_1.CommandError("Both voter and candidate must be in occasion channel.");
        yield Controller.vote(client, voiceChannel, author.id, candidate.id);
        return (0, Embeds_1.voteConfimation)(candidate.username);
    });
}
exports.vote = vote;
function playerRating(client, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const rating = yield client.database.getRanking();
        const rateId = `rate${author.id}`;
        if (client.lists.get(rateId))
            client.lists.delete(rateId);
        const list = new Utils_1.List(30, (0, Embeds_1.ratingList)(rating), 5);
        client.lists.set(rateId, list);
        const prevId = `previousPage.${author.id} ${rateId}`;
        const nextId = `nextPage.${author.id} ${rateId}`;
        list.create(channel, (0, Embeds_1.ListMessage)(prevId, nextId));
    });
}
exports.playerRating = playerRating;
