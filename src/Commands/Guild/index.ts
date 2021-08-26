import { Guild, User } from 'discord.js';
import ExtendedClient from '../../Client';

export async function announce(client: ExtendedClient, author: User, guild: Guild, title: string, description: string, image?: string) {
    await client.occasionController.Announce(client, title, description, guild, author, image);
}

export async function start(client: ExtendedClient, author: User, guild: Guild, title: string, description: string) {
    await client.occasionController.Start(client, guild, author, title, description);
}

export async function finish(client: ExtendedClient, author: User, guild: Guild, results: string) {
    await client.occasionController.Finish(client, guild, author, results);
}