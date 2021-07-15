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
exports.button = {
    name: 'dislikeHost',
    description: "",
    run: (client, component, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (args.length != 1)
                throw Error("Too much arguments");
            const author = component.clicker.id;
            const host = args[0];
            yield client.ratingController.dislikeHost(client, host, author);
            yield component.reply.send(client.embeds.hostCommended(), { ephemeral: true });
        }
        catch (error) {
            yield component.reply.send(client.embeds.errorInformation(error), { ephemeral: true });
        }
    })
};
