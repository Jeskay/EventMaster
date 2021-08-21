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
const List_1 = require("../../List");
const Error_1 = require("../../Error");
exports.command = {
    name: 'subscribtions',
    description: "shows your subscription list",
    aliases: ['subs'],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.length != 0)
            return;
        try {
            const profile = yield client.database.getPlayer(message.author.id);
            if (!profile)
                throw new Error_1.CommandError("This user did not join events.");
            const subId = `subs${message.author.id}`;
            if (client.Lists.get(subId))
                client.Lists.delete(subId);
            const tags = yield profile.subscriptions;
            const list = new List_1.List(30, client.helper.subscriptionList(tags), 5);
            client.Lists.set(subId, list);
            const prevId = `previousPage.${message.author.id} ${subId}`;
            const nextId = `nextPage.${message.author.id} ${subId}`;
            list.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        }
        catch (error) {
            if (error instanceof Error)
                message.channel.send({ embeds: [client.embeds.errorInformation(error.name, error.message)] });
        }
    })
};