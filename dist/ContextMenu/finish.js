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
const Guild_1 = require("../Commands/Guild");
const Error_1 = require("../Error");
const Interfaces_1 = require("../Interfaces");
exports.command = {
    name: 'finish message',
    type: Interfaces_1.ContextType.MESSAGE,
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!interaction.guild)
                throw new Error_1.ConditionError("This is allowed only in guild channel");
            const result = interaction.options.getMessage("message");
            if (!result)
                throw new Error_1.CommandError("Unable to find a message.");
            yield (0, Guild_1.finish)(client, interaction.user, interaction.guild, result.content);
        }
        catch (error) {
            (0, Error_1.handleCommandError)(client, interaction, error);
        }
    })
};
