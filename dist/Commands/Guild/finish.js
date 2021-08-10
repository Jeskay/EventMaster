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
    name: 'finishgame',
    description: 'finish an event and close room',
    aliases: ['fg', 'finish'],
    options: [{ name: 'result', required: true, description: 'Message that will be sent to log channel' }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (!guild)
            return;
        try {
            if (args.length < 1)
                throw Error("Event results must be provided. Ask moderation about respond format.");
            yield client.occasionController.Finish(client, guild, message.author, args.join(' '));
        }
        catch (error) {
            message.channel.send(client.embeds.errorInformation(error));
        }
    })
};
