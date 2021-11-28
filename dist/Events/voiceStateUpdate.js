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
exports.event = void 0;
const Controllers_1 = require("../Controllers");
const Controllers_2 = require("../Controllers");
exports.event = {
    name: 'voiceStateUpdate',
    run: (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
        if (newState.member == null || newState.member.user.bot)
            return;
        try {
            const state = (0, Controllers_1.checkState)(oldState, newState);
            switch (state) {
                case Controllers_1.MemberState.other:
                    break;
                case Controllers_1.MemberState.joined:
                    yield (0, Controllers_2.joinHandler)(client, newState.member, newState.channel);
                    break;
                case Controllers_1.MemberState.left:
                    yield (0, Controllers_2.leftHandler)(client, oldState.channel);
                    break;
                case Controllers_1.MemberState.moved:
                    yield (0, Controllers_2.joinHandler)(client, newState.member, newState.channel);
                    yield (0, Controllers_2.leftHandler)(client, oldState.channel);
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    })
};
