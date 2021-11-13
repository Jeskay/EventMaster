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
exports.Election = void 0;
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
        return __awaiter(this, void 0, void 0, function* () {
            if (this.votes.has(voter))
                throw Error("Person has already voted");
            if (this.score[candidate] == undefined)
                this.score[candidate] = 1;
            else
                this.score[candidate]++;
            this.votes[voter] = candidate;
            if (this.check(candidate))
                return true;
            return false;
        });
    }
    remove(voter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.votes.has(voter))
                throw Error("Person has not voted yet");
            const candidate = this.votes[voter];
            this.score[candidate]--;
            this.votes.delete(voter);
        });
    }
}
exports.Election = Election;
