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
    name: 'previousPage',
    description: "",
    run: (client, component, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (args.length != 2)
                throw Error("Only one argument required.");
            const author = args[0];
            const list = client.Lists.get(args[1]);
            if (!list)
                return;
            if (author != component.clicker.id)
                return;
            const embed = yield list.previous(component.message.id);
            yield component.message.edit(embed);
            component.reply.defer(true);
        }
        catch (error) {
            yield component.reply.send(client.embeds.errorInformation(error), { ephemeral: true });
        }
    })
};
