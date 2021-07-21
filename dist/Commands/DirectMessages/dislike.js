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
exports.command = void 0;
exports.command = {
    name: 'dislike',
    description: "Send a negative comment about user",
    options: [{ name: "userId", required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.guild)
            return;
        if (args.length != 1)
            return;
        try {
            let userId = args[0];
            if (message.guild)
                userId = client.helper.extractID(args[0]);
            const user = yield client.users.cache.get(userId);
            if (!user)
                throw Error("User does not exists.");
            yield client.ratingController.DislikePlayer(client, user.id, message.author.id);
            yield message.channel.send(client.embeds.playerCommended(user));
        }
        catch (error) {
            message.channel.send(error);
        }
    })
};
