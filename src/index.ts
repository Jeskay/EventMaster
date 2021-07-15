require('dotenv').config();
import "reflect-metadata";
import Client from './Client';
import disbut from 'discord-buttons';

const client = new Client();
disbut(client);
client.init();