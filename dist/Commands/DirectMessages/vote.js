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
exports.command = {
    name: 'vote',
    description: "vote for event host",
    aliases: ['v'],
    options: [{ name: 'user', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const author = message.author;
        if (args.length != 1)
            return;
        let candidateID = args[0];
        if (message.guild)
            candidateID = client.helper.extractID(args[0]);
        try {
            if (author.id == candidateID)
                throw new Error_1.CommandError("You can't vote for yourself.");
            const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidateID, channel));
            if (!voiceChannel)
                throw new Error_1.CommandError("Both voter and candidate must be in occasion channel.");
            yield client.occasionController.Vote(client, voiceChannel, author.id, candidateID);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
