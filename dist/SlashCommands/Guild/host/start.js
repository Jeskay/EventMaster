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
const Guild_1 = require("../../../Commands/Guild");
const Error_1 = require("../../../Error");
exports.command = {
    name: 'start',
    description: 'starts an event',
    aliases: ['s'],
    options: [
        { name: 'title', type: "STRING", description: "occasion title", required: true },
        { name: 'description', type: "STRING", description: "brief information about occasion", required: true }
    ],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.guild)
                throw new Error_1.CommandError("This is allowed only in guild channel.");
            const title = interaction.options.getString("title", true);
            const description = interaction.options.getString("description", true);
            const response = yield (0, Guild_1.start)(client, interaction.user, interaction.guild, title, description);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            (0, Error_1.handleCommandError)(client, interaction, error);
        }
        ;
    })
};
