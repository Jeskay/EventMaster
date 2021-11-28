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
const DirectMessages_1 = require("../../Commands/DirectMessages");
const Error_1 = require("../../Error");
const Embeds_1 = require("../../Embeds");
exports.button = {
    name: 'globalprofile',
    description: "",
    run: (client, button, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (args.length != 1)
                throw new Error_1.CommandError("Only one argument required.");
            const user = yield client.users.fetch(args[0]);
            const response = yield (0, DirectMessages_1.profile)(client, user, (_a = button.guild) !== null && _a !== void 0 ? _a : undefined);
            yield button.update(response);
        }
        catch (error) {
            if (error instanceof Error)
                button.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message)], ephemeral: true });
        }
    })
};
