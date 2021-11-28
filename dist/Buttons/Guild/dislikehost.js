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
exports.button = void 0;
const Controllers_1 = require("../../Controllers");
const Error_1 = require("../../Error");
const Embeds_1 = require("../../Embeds");
exports.button = {
    name: 'dislikeHost',
    description: "",
    run: (client, button, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (args.length != 1)
                throw new Error_1.CommandError("Too much arguments");
            const author = button.user.id;
            const host = args[0];
            yield (0, Controllers_1.dislikeHost)(client, host, author);
            yield button.reply({ embeds: [(0, Embeds_1.hostCommended)()], ephemeral: true });
        }
        catch (error) {
            if (error instanceof Error)
                button.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message)], ephemeral: true });
        }
    })
};
