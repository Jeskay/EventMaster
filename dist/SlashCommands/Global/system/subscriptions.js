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
const DirectMessages_1 = require("../../../Commands/DirectMessages");
exports.command = {
    name: 'subscribtions',
    description: "shows your subscription list",
    options: [],
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.channel)
                throw new Error_1.CommandError("Channel not found");
            yield (0, DirectMessages_1.subscriptions)(client, interaction.user, interaction);
        }
        catch (error) {
            if (error instanceof Error)
                interaction.reply({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
