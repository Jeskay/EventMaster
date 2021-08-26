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
const Guild_1 = require("../../Commands/Guild");
const Error_1 = require("../../Error");
exports.command = {
    name: 'announce',
    description: 'declare in notification channel about the event',
    options: [
        { name: 'title', type: "STRING", description: "announcement title", required: true },
        { name: 'description', type: "STRING", description: "brief information about occasion", required: true },
        { name: 'image', type: "STRING", description: "Image url which will be added to announce message", required: false }
    ],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (!interaction.guild)
                throw new Error_1.CommandError("You can use this command only in guild");
            const title = interaction.options.getString("title", true);
            const description = interaction.options.getString("description", true);
            const image = (_a = interaction.options.getString("image")) !== null && _a !== void 0 ? _a : undefined;
            yield Guild_1.announce(client, interaction.user, interaction.guild, title, description, image);
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)], ephemeral: true });
        }
    })
};
