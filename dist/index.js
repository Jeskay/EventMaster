"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const Client_1 = __importDefault(require("./Client"));
const discord_buttons_1 = __importDefault(require("discord-buttons"));
const client = new Client_1.default();
discord_buttons_1.default(client);
client.init();
