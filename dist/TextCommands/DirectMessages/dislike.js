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
const Error_1 = require("../../Error");
const DirectMessages_1 = require("../../Commands/DirectMessages");
const Utils_1 = require("../../Utils");
exports.command = {
    name: 'dislike',
    description: "Send a negative comment about user",
    options: [{ name: "userId", type: "USER" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.guild)
            return;
        if (args.length != 1)
            return;
        try {
            let userId = args[0];
            if (message.guild)
                userId = (0, Utils_1.extractID)(args[0]);
            const user = yield client.users.cache.get(userId);
            if (!user)
                throw new Error_1.CommandError("User does not exists.");
            const reponse = yield (0, DirectMessages_1.dislike)(client, message.author, user);
            yield message.channel.send({ embeds: [reponse] });
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
