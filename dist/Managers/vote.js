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
exports.VoteManager = exports.Election = void 0;
class Election {
    constructor(goal) {
        this.goal = goal;
        this.votes = new Map();
        this.score = new Map();
    }
    check(candidate) {
        if (this.score[candidate] >= this.goal) {
            this.leader = candidate;
            return true;
        }
        return false;
    }
    add(voter, candidate) {
        return new Promise((resolve, reject) => {
            if (this.votes.has(voter))
                reject();
            if (this.score[candidate] == undefined)
                this.score[candidate] = 1;
            else
                this.score[candidate]++;
            this.votes[voter] = candidate;
            if (this.check(candidate))
                resolve(true);
            resolve(false);
        });
    }
    remove(voter) {
        return new Promise((resolve, reject) => {
            if (!this.votes.has(voter))
                reject();
            const candidate = this.votes[voter];
            this.score[candidate]--;
            this.votes.delete(voter);
            resolve();
        });
    }
}
exports.Election = Election;
class VoteManager {
    constructor() {
        this.elections = new Map();
    }
    start(occasion, goal) {
        this.elections[occasion] = new Election(goal);
        console.log(`election in voice ${occasion} started`);
    }
    finish(occasion) {
        this.elections.delete(occasion);
    }
    removeCandidate(user, occasion) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!this.elections.has(occasion))
                    reject();
                yield this.elections[occasion].remove(user).catch((err) => reject(err));
                resolve();
            }));
        });
    }
    vote(occasion, voter, candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.elections[occasion] == undefined)
                    reject();
                const elected = yield this.elections[occasion].add(voter, candidate).catch(err => reject(err));
                if (elected) {
                    resolve(this.elections[occasion].leader);
                }
                resolve(null);
            }));
        });
    }
}
exports.VoteManager = VoteManager;
