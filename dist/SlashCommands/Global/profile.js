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
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    options: [{ name: 'user', type: "USER", description: "user who's profile you want to see.", required: false }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const user = (_a = interaction.options.getUser('user')) !== null && _a !== void 0 ? _a : interaction.user;
            const response = yield (0, DirectMessages_1.profile)(client, user);
            yield interaction.reply({ embeds: [response] });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
