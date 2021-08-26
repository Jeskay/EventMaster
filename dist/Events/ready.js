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
exports.event = void 0;
exports.event = {
    name: 'ready',
    run: (client) => __awaiter(void 0, void 0, void 0, function* () {
        if (!client.user)
            throw new Error("User is null");
        const clientId = client.user.id;
        ;
        console.log(`${client.user.tag} is online`);
        yield Promise.all(client.guilds.cache.map((guild) => __awaiter(void 0, void 0, void 0, function* () { yield client.registerGuildCommands(guild, clientId); })));
        yield client.registerGlobalCommands();
        yield client.registerContextMenu();
    })
};
