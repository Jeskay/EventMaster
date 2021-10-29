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
const DirectMessages_1 = require("../../../Commands/DirectMessages");
exports.command = {
    name: 'vote',
    description: "vote for event host",
    options: [{ name: 'user', type: "USER", description: "User you want to be a host.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = interaction.options.getUser("user", true);
            const response = yield (0, DirectMessages_1.vote)(client, interaction.user, user);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};