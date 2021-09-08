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
const room_1 = require("../Managers/room");
exports.event = {
    name: 'voiceStateUpdate',
    run: (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
        if (newState.member == null || newState.member.user.bot)
            return;
        try {
            const state = client.room.checkState(oldState, newState);
            switch (state) {
                case room_1.MemberState.other:
                    break;
                case room_1.MemberState.joined:
                    yield client.channelController.joinHandler(client, newState.member, newState.channel);
                    break;
                case room_1.MemberState.left:
                    yield client.channelController.leftHandler(client, oldState.channel);
                    break;
                case room_1.MemberState.moved:
                    yield client.channelController.joinHandler(client, newState.member, newState.channel);
                    yield client.channelController.leftHandler(client, oldState.channel);
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    })
};
