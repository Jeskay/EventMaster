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
exports.DataBaseManager = void 0;
const typeorm_1 = require("typeorm");
const server_1 = require("../entities/server");
const occasion_1 = require("../entities/occasion");
const player_1 = require("../entities/player");
const commend_1 = require("../entities/commend");
const tag_1 = require("../entities/tag");
const Error_1 = require("../Error");
const Utils_1 = require("../Utils");
const member_1 = require("../entities/member");
class DataBaseManager {
    constructor() {
        this.connect = () => __awaiter(this, void 0, void 0, function* () { return yield this.connection.connect(); });
        this.occasion = (event) => this.connection.manager.create(occasion_1.Occasion, event);
        this.player = (player) => this.connection.manager.create(player_1.Player, player);
        this.commend = (commend) => this.connection.manager.create(commend_1.Commend, commend);
        this.server = (server) => this.connection.manager.create(server_1.Server, server);
        this.tag = (tag) => this.connection.manager.create(tag_1.Tag, tag);
        this.getServer = (id) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.findOne(server_1.Server, { guild: id }); });
        this.getPlayer = (id) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.findOne(player_1.Player, { id: id }); });
        this.getCommend = (authorId, subjectId, hosting, cheer) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.findOne(commend_1.Commend, { authorId: authorId, subjectId: subjectId, host: hosting, cheer: cheer }); });
        this.getTag = (id) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.findOne(tag_1.Tag, { title: id }); });
        this.getCommends = (params) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.find(commend_1.Commend, params); });
        this.connection = (0, typeorm_1.getConnection)();
    }
    getMember(server, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let member;
            if (server instanceof server_1.Server) {
                member = server.members.find((member) => user instanceof player_1.Player ? member.player == user : member.id == user);
            }
            else if (user instanceof player_1.Player) {
                member = user.membership.find((member) => member.guildId == server);
            }
            else {
                const player = yield this.getPlayerRelation(user);
                member = player.membership.find(member => member.guildId == server);
            }
            if (!member)
                throw new Error_1.DataBaseError("User is not a member of guild.");
            return member;
        });
    }
    getRanking(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (guildId)
                return yield this.connection.manager.getRepository(member_1.GuildMember)
                    .createQueryBuilder("guild_member")
                    .where("guild_member.guildId = :guildId", { guildId: guildId })
                    .getMany();
            else
                return yield this.connection.manager.getRepository(player_1.Player)
                    .createQueryBuilder("player")
                    .leftJoinAndSelect("player.commendsBy", "commend", "commend.author = id")
                    .leftJoinAndSelect("player.commendsAbout", "commend2", "commend2.subject = id")
                    .getMany();
        });
    }
    getServerRelations(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.connection.getRepository(server_1.Server)
                .createQueryBuilder("server")
                .leftJoinAndSelect("server.events", "occasion")
                .leftJoinAndSelect("server.members", "guild_member")
                .where("server.guild = :guild", { guild: serverID })
                .getOne()
                .catch(err => { throw err; });
            if (!server)
                throw new Error_1.DataBaseError("Guild with followed id is not registered.");
            return server;
        });
    }
    getPlayerRelation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.connection.getRepository(player_1.Player)
                .createQueryBuilder("player")
                .leftJoinAndSelect("player.subscriptions", "tag")
                .where("player.id = :id", { id: userId })
                .leftJoinAndSelect("player.membership", "guild_member")
                .getOne()
                .catch(err => { throw err; });
            if (!user)
                throw new Error_1.DataBaseError("Player with followed id is not registered.");
            return user;
        });
    }
    addServer(server) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.connection.manager.create(server_1.Server, server);
            yield this.connection.manager.save(post);
        });
    }
    addPlayer(player) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.player(player);
            yield this.connection.manager.save(post);
            return post;
        });
    }
    addMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.connection.manager.create(member_1.GuildMember, member);
            post.score = 0;
            yield this.connection.manager.save(post);
        });
    }
    addOccasion(guildID, occasion) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.occasion(occasion);
            const server = yield this.getServer(guildID);
            if (!server)
                throw new Error_1.DataBaseError("Guild with followed id is not registered.");
            else if (server.events && server.events.includes(post))
                throw new Error_1.DataBaseError("There is an occasion's duplicate.");
            yield this.connection.manager.save(post);
        });
    }
    addCommend(commend) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.commend(commend);
            yield this.connection.manager.save(post);
        });
    }
    addTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.tag(tag);
            yield this.connection.manager.save(post);
        });
    }
    removeServer(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServer(serverID);
            if (server == undefined)
                throw new Error_1.DataBaseError("Server does not exist");
            this.connection.manager.remove(server);
        });
    }
    removeOccasion(guildID, voiceChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServerRelations(guildID);
            if (!server)
                throw new Error_1.DataBaseError("Guild with followed id is not registered.");
            const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
            if (!occasion)
                throw new Error_1.DataBaseError("Cannot find occasion with following voice channel");
            yield this.connection.manager.remove(occasion);
            return { voice: occasion.voiceChannel, text: occasion.textChannel };
        });
    }
    removePlayer(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield this.getPlayer(userID);
            if (!player)
                throw new Error_1.DataBaseError("Cannot find player");
            yield this.connection.manager.remove(player);
        });
    }
    removeMember(serverId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.getMember(serverId, userId);
            if (!member)
                throw new Error_1.DataBaseError("Cannot find player");
            yield this.connection.manager.remove(member);
        });
    }
    removeTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.getTag(tagId);
            if (!tag)
                throw new Error_1.DataBaseError("Tag does not exist.");
            yield this.connection.manager.remove(tag);
        });
    }
    updateServer(guildID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.getServer(guildID);
            if (!current)
                throw new Error_1.DataBaseError("Cannot find server.");
            else
                Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
            yield this.connection.manager.save(current);
        });
    }
    updateSettings(guildID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServer(guildID);
            if (!server)
                throw new Error_1.DataBaseError("Cannot find server.");
            Object.keys(server.settings).forEach(key => server.settings[key] = key in params ? params[key] : server.settings[key]);
            yield this.connection.manager.save(server);
        });
    }
    updateOccasion(guildID, voiceChannel, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServerRelations(guildID);
            if (!server)
                throw new Error_1.DataBaseError("Guild with followed id is not registered.");
            const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
            if (!occasion)
                throw new Error_1.DataBaseError("Cannot find occasion with following voice channel.");
            Object.keys(occasion).forEach(key => occasion[key] = key in params ? params[key] : occasion[key]);
            yield this.connection.manager.save(occasion);
        });
    }
    updatePlayer(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            let player;
            if (instance instanceof player_1.Player) {
                player = instance;
            }
            else {
                if (!Object.keys(instance).includes('id'))
                    throw new Error_1.DataBaseError("Player id must be provided.");
                const result = yield this.getPlayer(instance['id']);
                if (!result)
                    throw new Error_1.DataBaseError("Cannot find the player.");
                console.log(Object.keys(result));
                Object.keys(result).forEach(key => result[key] = key in instance ? instance[key] : result[key]);
                player = result;
            }
            player.score = (0, Utils_1.calculateScore)(player);
            yield this.connection.manager.save(player);
        });
    }
    updateMember(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = (instance instanceof member_1.GuildMember) ? instance : this.connection.manager.create(member_1.GuildMember, instance);
            member.score = (0, Utils_1.calculateScore)(member);
            yield this.connection.manager.save(member);
        });
    }
    updateCommend(commend, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.getRepository(commend_1.Commend).update({
                authorId: commend.authorId,
                subjectId: commend.subjectId,
                host: commend.host,
                cheer: commend.cheer
            }, params);
        });
    }
}
exports.DataBaseManager = DataBaseManager;
