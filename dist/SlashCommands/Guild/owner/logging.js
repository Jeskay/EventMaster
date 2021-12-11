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
const Setup_1 = require("../../../Commands/Setup");
const Error_1 = require("../../../Error");
exports.command = {
    name: 'logging',
    description: "set log channel where bot will post information about passed events",
    aliases: ['log'],
    options: [{ name: 'channel', type: "CHANNEL", description: "Channel to send occasion logs.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.guild)
                throw new Error_1.CommandError("Avaliable only in a guild.");
            const channel = interaction.options.getChannel("channel", true);
            const response = yield (0, Setup_1.setLog)(client, interaction.guild, interaction.user, channel);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            (0, Error_1.handleCommandError)(client, interaction, error);
        }
    })
};
