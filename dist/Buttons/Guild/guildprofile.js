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
const Guild_1 = require("../../Commands/Guild");
const Error_1 = require("../../Error");
exports.button = {
    name: 'guildprofile',
    description: "",
    run: (client, button, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (args.length != 1)
                throw new Error_1.CommandError("Only one argument required.");
            if (!button.guild)
                throw new Error_1.CommandError("Available only in guild.");
            const user = yield button.guild.members.fetch(args[0]);
            const response = yield (0, Guild_1.guildProfile)(client, user, button.guild);
            yield button.update(response);
        }
        catch (error) {
            (0, Error_1.handleCommandError)(client, button, error);
        }
    })
};
