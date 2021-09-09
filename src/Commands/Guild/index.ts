import { Guild, User } from 'discord.js';
import ExtendedClient from '../../Client';

export async function announce(client: ExtendedClient, author: User, guild: Guild, description: string, title?: string , image?: string) {
    return await client.occasionController.announce(client, description, guild, author, title, image);
}

export async function start(client: ExtendedClient, author: User, guild: Guild, title: string, description: string) {
    return await client.occasionController.start(client, guild, author, title, description);
}

export async function finish(client: ExtendedClient, author: User, guild: Guild, results: string) {
    return await client.occasionController.finish(client, guild, author, results);
}