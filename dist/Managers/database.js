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
class DataBaseManager {
    constructor() {
        this.connect = () => __awaiter(this, void 0, void 0, function* () { return yield this.connection.connect(); });
        this.getServer = (serverID) => __awaiter(this, void 0, void 0, function* () { return yield this.connection.manager.findOne(server_1.Server, { guild: serverID }); });
        this.occasion = (event) => this.connection.manager.create(occasion_1.Occasion, event);
        this.connection = typeorm_1.getConnection();
    }
    getServerRelations(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.connection.getRepository(server_1.Server)
                .createQueryBuilder("server")
                .leftJoinAndSelect("server.events", "occasion")
                .where("server.guild = :guild", { guild: serverID })
                .getOne()
                .catch(err => { throw err; });
            if (!server)
                throw Error("Guild with followed id is not registered.");
            return server;
        });
    }
    updateServer(guildID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.getServer(guildID);
            if (!current)
                throw Error("Cannot find server.");
            else
                Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
            yield this.connection.manager.save(current);
        });
    }
    addOccasion(guildID, occasion) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.occasion(occasion);
            const server = yield this.getServer(guildID);
            if (!server)
                throw Error("Guild with followed id is not registered.");
            else if (server.events && server.events.includes(post))
                throw Error("There is occasion's duplicate.");
            yield this.connection.manager.save(post);
        });
    }
    removeOccasion(guildID, voiceChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServerRelations(guildID);
            if (!server)
                throw Error("Guild with followed id is not registered.");
            const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
            if (!occasion)
                throw Error("Cannot find occasion with following voice channel");
            yield this.connection.manager.remove(occasion);
            return { voice: occasion.voiceChannel, text: occasion.textChannel };
        });
    }
    addServer(server) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.connection.manager.create(server_1.Server, server);
            const duplicate = yield this.getServer(post.guild);
            if (duplicate)
                throw Error("Server with such id already exists.");
            yield this.connection.manager.save(post);
        });
    }
    removeServer(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServer(serverID);
            if (server == undefined)
                throw Error("");
            this.connection.manager.remove(server);
        });
    }
}
exports.DataBaseManager = DataBaseManager;
