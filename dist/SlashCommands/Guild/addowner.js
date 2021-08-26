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
const Setup_1 = require("../../Commands/Setup");
const Error_1 = require("../../Error");
exports.command = {
    name: 'addowner',
    description: 'Gives user extended permissions for bot settings',
    aliases: ['setowner'],
    options: [{ name: 'user', type: "USER", description: "A user to give extended permissions.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = interaction.options.getUser("user", true);
            if (!interaction.guild)
                throw new Error_1.CommandError("Avaliable only in guild.");
            const response = yield Setup_1.addOwner(client, interaction.guild, interaction.user, user);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true });
        }
    })
};
