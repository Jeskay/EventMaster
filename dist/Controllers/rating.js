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
exports.RatingController = void 0;
class RatingController {
    constructor() {
        this.likeCoolDown = 1;
        this.DislikePlayer = (client, user, author) => __awaiter(this, void 0, void 0, function* () { return yield this.commendPlayer(client, user, author, false, false); });
        this.LikePlayer = (client, user, author) => __awaiter(this, void 0, void 0, function* () { return yield this.commendPlayer(client, user, author, true, false); });
        this.likeHost = (client, user, author) => __awaiter(this, void 0, void 0, function* () { return yield this.commendPlayer(client, user, author, true, true); });
        this.dislikeHost = (client, user, author) => __awaiter(this, void 0, void 0, function* () { return yield this.commendPlayer(client, user, author, false, true); });
    }
    hoursDiference(date1, date2) {
        const diff = date1.getTime() - date2.getTime();
        return diff / 1000 / 60 / 60;
    }
    fetchPlayers(client, user1, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            const first = yield client.database.getPlayer(user1);
            const second = yield client.database.getPlayer(user2);
            if (!first || !second)
                throw Error("Cannot find the player.");
            return { first, second };
        });
    }
    commendPlayer(client, user, author, positive, hosting) {
        return __awaiter(this, void 0, void 0, function* () {
            if (author == user)
                throw Error("User can't commend himself.");
            const { first, second } = yield this.fetchPlayers(client, user, author);
            if (hosting) {
                const difference = this.hoursDiference(new Date, second.scoreTime);
                if (difference < this.likeCoolDown)
                    throw Error(`Wait ${Math.round(difference - this.likeCoolDown)} hours.`);
            }
            const commendsBy = yield second.commendsBy;
            console.log(commendsBy);
            const commend = commendsBy.find(commend => commend.subjectId == user && commend.host == hosting && commend.cheer == positive);
            if (commend) {
                yield client.database.updateCommend(commend, {
                    duplicates: commend.duplicates + 1,
                });
            }
            else
                yield client.database.addCommend({
                    authorId: author,
                    subjectId: user,
                    author: second,
                    subject: first,
                    host: hosting,
                    cheer: positive,
                    duplicates: 1
                });
        });
    }
    updateMembers(client, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield client.database.getServerRelations(channel.guild.id);
            const occasion = server.events.find(event => event.voiceChannel == channel.id);
            if (!occasion)
                throw Error("Cannot find the occasion.");
            const host = occasion.host;
            yield Promise.all(channel.members.map((member) => __awaiter(this, void 0, void 0, function* () {
                const player = yield client.database.getPlayer(member.id);
                if (!player)
                    yield client.database.addPlayer({
                        id: member.id,
                        eventsPlayed: (member.id == host) ? 0 : 1,
                        eventsHosted: (member.id == host) ? 1 : 0,
                    });
                else
                    yield client.database.updatePlayer({
                        id: member.id,
                        eventsPlayed: (member.id == host) ? player.eventsPlayed : player.eventsPlayed + 1,
                        eventsHosted: (member.id == host) ? player.eventsHosted + 1 : player.eventsHosted
                    });
            })));
        });
    }
}
exports.RatingController = RatingController;
