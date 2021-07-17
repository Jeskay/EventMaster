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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const console_1 = __importDefault(require("console"));
exports.command = {
    name: 'like',
    description: "send a positive comment about user",
    aliases: [],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.length != 1)
            return;
        try {
            let userId = args[0];
            if (message.guild)
                userId = client.helper.extractID(args[0]);
            const user = yield client.users.cache.get(userId);
            if (!user)
                throw Error("User does not exists.");
            yield client.ratingController.LikePlayer(client, user.id, message.author.id);
            yield message.channel.send(client.embeds.playerCommended(user));
        }
        catch (error) {
            console_1.default.log("Error");
            message.channel.send(error);
        }
    })
};
