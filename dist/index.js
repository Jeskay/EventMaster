"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const Client_1 = __importDefault(require("./Client"));
const discord_js_1 = require("discord.js");
const intents = [
    discord_js_1.Intents.FLAGS.GUILDS,
    discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
    discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
    discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
];
const client = new Client_1.default({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: intents,
    partials: ['CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'USER']
});
client.init();
