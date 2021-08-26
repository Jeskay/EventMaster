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
const Interfaces_1 = require("../Interfaces");
const DirectMessages_1 = require("../Commands/DirectMessages");
const Error_1 = require("../Error");
exports.command = {
    name: 'vote',
    type: Interfaces_1.ContextType.USER,
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = interaction.options.getUser('user');
            if (!user)
                throw new Error_1.CommandError("Unable to find a user.");
            const response = yield DirectMessages_1.vote(client, interaction.user, user);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
