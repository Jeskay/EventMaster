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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const console_1 = __importDefault(require("console"));
exports.command = {
    name: 'help',
    aliases: ['h'],
    run: (client, message, _args) => __awaiter(void 0, void 0, void 0, function* () {
        const author = message.author;
        let dm = author.dmChannel;
        if (message.guild == null)
            return;
        if (dm == null)
            dm = yield author.createDM();
        const server = yield client.database.getServer(message.guild.id);
        console_1.default.log(server);
        if (server == null)
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Server information")
            .setDescription(`Description: ${server.description}`)
            .addField("Channel", server.eventChannel)
            .setFooter("Footer");
        dm.send(embed);
        dm.send(`Server owner is ${server.settings.owners[0]}`);
    })
};
