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
const Embeds_1 = require("../../../Embeds");
exports.command = {
    name: 'limit_events',
    description: 'set maximum amount of events at the same time',
    options: [{ name: 'amount', type: "INTEGER", description: "maximum amount of occasions which can exist at the same moment.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const limit = interaction.options.getInteger("amount", true);
            if (!interaction.guild)
                throw new Error_1.CommandError("Avaliable only in a guild.");
            const response = yield (0, Setup_1.setOccasionLimit)(client, interaction.guild, interaction.user, limit);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message, error.stack)], ephemeral: true });
        }
    })
};
