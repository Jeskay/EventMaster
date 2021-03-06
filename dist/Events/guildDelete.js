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
const Embeds_1 = require("../Embeds");
exports.event = {
    name: 'guildDelete',
    run: (client, guild) => __awaiter(void 0, void 0, void 0, function* () {
        const owner = yield client.users.fetch(guild.ownerId);
        if (owner == null)
            return;
        let dm = owner.dmChannel;
        if (dm == null)
            dm = yield owner.createDM();
        try {
            yield client.database.removeServer(guild.id);
            yield dm.send({ embeds: [(0, Embeds_1.farawell)(guild.name, owner.username)] });
        }
        catch (error) {
            if (error instanceof Error)
                yield dm.send({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message)] });
        }
    })
};
