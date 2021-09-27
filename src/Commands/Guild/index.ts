import { CommandInteraction, Guild, User } from 'discord.js';
import { CommandError } from '../../Error';
import { List, ratingList } from '../../Utils';
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
export async function guildProfile(client: ExtendedClient, author: User, guild: Guild) {
    const member = await client.database.getMember(guild.id, author.id);
    return client.embeds.memberProfile(member);
}
export async function guildRating(client: ExtendedClient, author: User, interaction: CommandInteraction) {
    if(!interaction.guildId) throw new CommandError("Available only in guild channels.");
    const rating = await client.database.getRanking(interaction.guildId);
    const rateId = `guildrate${author.id}`;
    if(client.lists.get(rateId)) client.lists.delete(rateId);
    const list = new List(30, ratingList(rating), 10);
    client.lists.set(rateId, list);
    const prevId = `previousPage.${author.id} ${rateId}`;
    const nextId = `nextPage.${author.id} ${rateId}`;
    list.create(interaction, client.embeds.ListMessage(prevId, nextId));
}