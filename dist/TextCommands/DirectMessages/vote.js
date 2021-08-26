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
const DirectMessages_1 = require("../../Commands/DirectMessages");
exports.command = {
    name: 'vote',
    description: "vote for event host",
    aliases: ['v'],
    options: [{ name: 'user', type: "USER" }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.length != 1)
            return;
        let candidateID = args[0];
        if (message.guild)
            candidateID = client.helper.extractID(args[0]);
        const candidate = yield client.users.fetch(candidateID);
        try {
            yield DirectMessages_1.vote(client, message.author, candidate);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
