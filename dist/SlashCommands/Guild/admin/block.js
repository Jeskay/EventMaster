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
const Error_1 = require("../../../Error");
const Setup_1 = require("../../../Commands/Setup");
exports.command = {
    name: 'block',
    description: 'add user to black list, so he cannot became host on this server',
    aliases: ['bl'],
    options: [{ name: 'user', type: "USER", description: "User to add in blacklist.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.guild)
                throw new Error_1.CommandError("Avaliable only in a guild.");
            const user = interaction.options.getUser("user", true);
            const response = yield (0, Setup_1.addToBlackList)(client, interaction.guild, interaction.user, user);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            (0, Error_1.handleCommandError)(client, interaction, error);
        }
    })
};
