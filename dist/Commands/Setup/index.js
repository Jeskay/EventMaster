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
exports.setOccasions = exports.setOccasionLimit = exports.removeFromBlackList = exports.addToBlackList = exports.setNotification = exports.setEventRole = exports.setLog = exports.setLimit = exports.removeOwner = exports.addOwner = void 0;
const Error_1 = require("../../Error");
function addOwner(client, guild, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        const settings = server.settings;
        if (author.id != guild.ownerId)
            throw new Error_1.CommandError("Permission denied.");
        if (!user)
            throw new Error_1.CommandError("Cannot find a user.");
        if (settings.owners.includes(user.id))
            throw new Error_1.CommandError("This user already has owner permissions");
        settings.owners.push(user.id);
        yield client.database.updateSettings(server.guild, {
            owners: settings.owners
        });
        return client.embeds.ownerAdded(user.username);
    });
}
exports.addOwner = addOwner;
function removeOwner(client, guild, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        const settings = server.settings;
        if (author.id != guild.ownerId)
            throw new Error_1.CommandError("Permission denied.");
        if (!user)
            throw new Error_1.CommandError("Cannot find a user.");
        if (!settings.owners.includes(user.id))
            throw new Error_1.CommandError("This user does not have owner permissions");
        settings.owners.filter(id => id != user.id);
        yield client.database.updateSettings(server.guild, {
            owners: settings.owners
        });
        return client.embeds.ownerRemoved(user.username);
    });
}
exports.removeOwner = removeOwner;
function setLimit(client, guild, author, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        yield client.database.updateSettings(guild.id, { limit: limit });
        return client.embeds.limitChanged(limit);
    });
}
exports.setLimit = setLimit;
function setLog(client, guild, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS')
            throw new Error_1.CommandError("Only text or news channel allowed");
        yield client.database.updateSettings(guild.id, { logging_channel: channel.id });
        return `Channel ${channel.name} successfuly set for logging.`;
    });
}
exports.setLog = setLog;
function setEventRole(client, guild, author, role) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        yield client.database.updateSettings(guild.id, { event_role: role.id });
        return `Role ${role.name} will be mentioned in occasion notifications`;
    });
}
exports.setEventRole = setEventRole;
function setNotification(client, guild, author, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS')
            throw new Error_1.CommandError("Only text or news channel allowed");
        yield client.database.updateSettings(guild.id, { notification_channel: channel.id });
        return `Channel ${channel.name} successfuly set to notification.`;
    });
}
exports.setNotification = setNotification;
function addToBlackList(client, guild, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        const list = server.settings.black_list;
        const player = yield client.database.getPlayerRelation(user.id);
        player.banned = player.banned ? player.banned + 1 : 1;
        const member = player.membership.find(member => member.guildId == guild.id);
        if (!member)
            throw new Error_1.DataBaseError("User is not a member of this guild.");
        member.banned = true;
        list.push(user.id);
        yield client.database.updateMember(member);
        yield client.database.updatePlayer(player);
        yield client.database.updateSettings(guild.id, { black_list: list });
        return client.embeds.addedToBlackList(user.id);
    });
}
exports.addToBlackList = addToBlackList;
function removeFromBlackList(client, guild, author, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        const player = yield client.database.getPlayerRelation(user.id);
        if (player.banned)
            player.banned--;
        else
            throw new Error_1.CommandError("Player was not banned on this server.");
        const member = player.membership.find(member => member.guildId == guild.id);
        if (!member)
            throw new Error_1.DataBaseError("User is not a member of this guild.");
        member.banned = false;
        const list = server.settings.black_list;
        list.splice(list.indexOf(user.id));
        yield client.database.updateMember(member);
        yield client.database.updatePlayer(player);
        yield client.database.updateSettings(guild.id, { black_list: list });
        return client.embeds.removedFromBlackList(user.id);
    });
}
exports.removeFromBlackList = removeFromBlackList;
function setOccasionLimit(client, guild, author, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (amount < 1)
            throw new Error_1.CommandError("You can only use positive non zero numbers.");
        if (author.id != guild.ownerId)
            throw new Error_1.CommandError("Permission denied.");
        yield client.database.updateSettings(guild.id, { occasion_limit: amount });
        return client.embeds.occasionLimitChanged(amount);
    });
}
exports.setOccasionLimit = setOccasionLimit;
function setOccasions(client, guild, author, channel, category) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield client.database.getServer(guild.id);
        if (!server)
            throw new Error_1.CommandError("Server is not registered yet.");
        if (!server.settings.owners.includes(author.id))
            throw new Error_1.CommandError("Permission denied.");
        yield client.database.updateServer(guild.id, {
            eventChannel: channel.id,
            eventCategory: category.id
        });
        return "channel and category successfuly binded.";
    });
}
exports.setOccasions = setOccasions;
