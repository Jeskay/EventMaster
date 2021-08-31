require('dotenv').config();
import "reflect-metadata";
import Client from './Client';
import { Intents } from "discord.js";
const intents = [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.DIRECT_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
];
const client = new Client({
    allowedMentions: {parse: ['users', 'roles', 'everyone'], repliedUser: true},
    intents: intents,
    partials: ['CHANNEL', 'MESSAGE','GUILD_MEMBER', 'USER']
});
client.init();