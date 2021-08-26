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
const Setup_1 = require("../../Commands/Setup");
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [
        { name: 'channel', type: "CHANNEL", required: true, description: "Voice channel where to join to create an occasion." },
        { name: 'category', type: "CHANNEL", required: true, description: "Category where voice and text channels for new occasion will be created." }
    ],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.guild)
                throw new Error_1.CommandError("Available only in a guild.");
            const voice = interaction.options.getChannel('channel', true);
            const category = interaction.options.getChannel('category', true);
            if (!(voice instanceof discord_js_1.VoiceChannel && category instanceof discord_js_1.CategoryChannel))
                throw new Error_1.CommandError("Invalid channel type.");
            const response = yield Setup_1.setOccasions(client, interaction.guild, interaction.user, voice, category);
            yield interaction.reply({ content: response, ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true });
        }
    })
};
