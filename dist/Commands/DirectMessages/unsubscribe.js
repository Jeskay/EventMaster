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
exports.command = {
    name: 'unsubscribe',
    description: "remove subscribtion for personal events notifications",
    aliases: ['unsub'],
    options: [{ name: 'title', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.length > 1)
            return;
        try {
            const title = args[0];
            const profile = yield client.database.getPlayer(message.author.id);
            if (!profile)
                throw new Error_1.CommandError("This user did not join events.");
            const tags = yield profile.subscriptions;
            if (!tags.find(tag => tag.title == title))
                throw new Error_1.CommandError("You are not subscribed for this tag.");
            yield client.database.removeTag(title);
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};
