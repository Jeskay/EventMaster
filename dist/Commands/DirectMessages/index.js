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
exports.vote = exports.subscriptions = exports.unsubscribe = exports.subscribe = exports.profile = exports.help = exports.like = exports.dislike = void 0;
const List_1 = require("../../List");
const Error_1 = require("../../Error");
function dislike(client, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.ratingController.DislikePlayer(client, user.id, author.id);
        return client.embeds.playerCommended(user);
    });
}
exports.dislike = dislike;
function like(client, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.ratingController.LikePlayer(client, user.id, author.id);
        return client.embeds.playerCommended(user);
    });
}
exports.like = like;
function help(client, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const prevId = `previousPage.${author.id} help`;
        const nextId = `nextPage.${author.id} help`;
        const list = client.Lists.get('help');
        if (!list)
            throw new Error_1.CommandError('Command list not found.');
        yield list.create(channel, client.embeds.ListMessage(prevId, nextId));
    });
}
exports.help = help;
function profile(client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(user.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const commends = yield profile.commendsAbout;
        return client.embeds.playerInfo(profile, user, commends);
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
    });
}
exports.unsubscribe = unsubscribe;
function subscriptions(client, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield client.database.getPlayer(author.id);
        if (!profile)
            throw new Error_1.CommandError("This user did not join events.");
        const subId = `subs${author.id}`;
        if (client.Lists.get(subId))
            client.Lists.delete(subId);
        const tags = yield profile.subscriptions;
        const list = new List_1.List(30, client.helper.subscriptionList(tags), 5);
        client.Lists.set(subId, list);
        const prevId = `previousPage.${author.id} ${subId}`;
        const nextId = `nextPage.${author.id} ${subId}`;
        list.create(channel, client.embeds.ListMessage(prevId, nextId));
    });
}
exports.subscriptions = subscriptions;
function vote(client, author, candidate) {
    return __awaiter(this, void 0, void 0, function* () {
        if (author.id == candidate.id)
            throw new Error_1.CommandError("You can't vote for yourself.");
        const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidate.id, channel));
        if (!voiceChannel)
            throw new Error_1.CommandError("Both voter and candidate must be in occasion channel.");
        yield client.occasionController.Vote(client, voiceChannel, author.id, candidate.id);
        return client.embeds.voteConfimation(candidate.username);
    });
}
exports.vote = vote;
