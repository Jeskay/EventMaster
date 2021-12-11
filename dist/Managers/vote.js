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
exports.VoteManager = void 0;
const Error_1 = require("../Error");
const Utils_1 = require("../Utils");
class VoteManager {
    constructor() {
        this.elections = new Map();
    }
    start(occasion, goal) {
        this.elections[occasion] = new Utils_1.Election(goal);
    }
    finish(occasion) {
        this.elections.delete(occasion);
    }
    removeCandidate(user, occasion) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.elections.has(occasion))
                throw new Error_1.ConditionError("There is no current election in the channel.");
            yield this.elections[occasion].remove(user);
        });
    }
    vote(occasion, voter, candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.elections[occasion] == undefined)
                throw new Error_1.ConditionError("There is no current election in the channel.");
            return yield this.elections[occasion].add(voter, candidate);
        });
    }
}
exports.VoteManager = VoteManager;
