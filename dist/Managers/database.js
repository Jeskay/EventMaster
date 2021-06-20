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
        this.connect = () => __awaiter(this, void 0, void 0, function* () { return yield this.orm.connect(); });
        this.getServer = (serverID) => __awaiter(this, void 0, void 0, function* () { return yield this.orm.manager.findOne(server_1.Server, { guild: serverID }); });
        this.occasion = (event) => this.orm.manager.create(occasion_1.Occasion, event);
        this.orm = typeorm_1.getConnection();
    }
    getServerRelations(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orm.getRepository(server_1.Server)
                .createQueryBuilder("server")
                .leftJoinAndSelect("server.events", "occasion")
                .where("server.guild = :guild", { guild: serverID })
                .getOne();
        });
    }
    updateServer(guildID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.getServer(guildID);
            if (current == undefined)
                return false;
            Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
            yield this.orm.manager.save(current);
            return true;
        });
    }
    addOccasion(guildID, occasion) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.occasion(occasion);
            const server = yield this.getServer(guildID);
            if (server == undefined)
                return false;
            if (server.events != undefined && server.events.includes(post))
                return false;
            yield this.orm.manager.save(post);
            return true;
        });
    }
    removeOccasion(guildID, voiceChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServerRelations(guildID);
            if (server == undefined)
                throw Error;
            const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
            if (occasion == undefined)
                throw Error;
            yield this.orm.manager.remove(occasion);
            return { voice: occasion.voiceChannel, text: occasion.textChannel };
        });
    }
    addServer(server) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.orm.manager.create(server_1.Server, server);
            const duplicate = yield this.getServer(post.guild);
            if (duplicate != undefined)
                return false;
            yield this.orm.manager.save(post);
            return true;
        });
    }
    removeServer(serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield this.getServer(serverID);
            if (server == undefined)
                return false;
            this.orm.manager.remove(server);
            return true;
        });
    }
}
exports.DataBaseManager = DataBaseManager;
