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
exports.command = {
    name: 'help',
    aliases: ['h'],
    run: (client, message, _args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prevId = `previousPage.${message.author.id} help`;
            const nextId = `nextPage.${message.author.id} help`;
            const list = client.Lists.get('help');
            if (!list)
                throw Error('System error');
            yield list.create(message.channel, client.embeds.ListMessage(prevId, nextId));
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
