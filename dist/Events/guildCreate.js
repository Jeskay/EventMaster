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
const discord_js_1 = require("discord.js");
const settings_1 = require("../entities/settings");
exports.event = {
    name: 'guildCreate',
    run: (client, guild) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const owner = yield guild.members.fetch(guild.ownerID);
        const default_limit = 2;
        if (owner == null)
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setFooter("To configure use *setup* command right there.")
            .setDescription(`Thank you for inviting ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} to ${guild.name} ^^`);
        const settings = new settings_1.Settings(owner.id, default_limit, []);
        const added = yield client.database.addServer({
            settings: settings,
            events: [],
            guild: guild.id,
            description: "empty"
        });
        if (added) {
            let dm = owner.user.dmChannel;
            if (dm == null)
                dm = yield owner.createDM();
            dm.send(embed);
        }
    })
};
