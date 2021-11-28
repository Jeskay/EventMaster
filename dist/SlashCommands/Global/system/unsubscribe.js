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
const Embeds_1 = require("../../../Embeds");
exports.command = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    options: [{ name: 'title', type: "STRING", description: "Title which you don't want to be notified about.", required: true }],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const title = interaction.options.getString('title', true);
            const response = yield (0, DirectMessages_1.unsubscribe)(client, interaction.user, title);
            yield interaction.reply({ embeds: [response], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message, error.stack)] });
        }
    })
};
