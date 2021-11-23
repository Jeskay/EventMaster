import { CommandInteraction, Guild, GuildMember, TextBasedChannels, User } from 'discord.js';
import { CommandError, DataBaseError } from '../../Error';
import { blackmembersList, List, ratingList,  } from '../../Utils';
import * as Controller from '../../Controllers'
import ExtendedClient from '../../Client';
import { Profiles, memberProfile, ListMessage } from '../../Embeds';

export async function announce(client: ExtendedClient, author: User, guild: Guild, description: string, title?: string , image?: string) {
    return await Controller.announce(client, description, guild, author, title, image);
}

export async function start(client: ExtendedClient, author: User, guild: Guild, title: string, description: string) {
    return await Controller.start(client, guild, author, title, description);
}

export async function finish(client: ExtendedClient, author: User, guild: Guild, results: string) {
    return await Controller.finish(client, guild, author, results);
}
export async function guildProfile(client: ExtendedClient, guildUser: User | GuildMember, guild: Guild) {
    const member = await client.database.getMember(guild.id, guildUser.id);
    const row = Profiles(true, guildUser.id, guild.id);
    const embed = memberProfile(member, guildUser instanceof User ? guildUser : guildUser.user);
    return {embeds: [embed], components: [row], ephemeral: true};
}
export async function blackList(client: ExtendedClient, channel: TextBasedChannels | CommandInteraction, author: User, guild: Guild) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new DataBaseError("Server is not registered");
    const embed = blackmembersList(server.settings.black_list);
    const blacklistId = `blacklist${author.id}`;
    if(client.lists.get(blacklistId)) client.lists.delete(blacklistId);
    const list = new List(30, embed, 10);
    client.lists.set(blacklistId, list);
    const prevId = `previousPage.${author.id} ${blacklistId}`;
    const nextId = `nextPage.${author.id} ${blacklistId}`;
    list.create(channel, ListMessage(prevId, nextId));
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
    list.create(interaction, ListMessage(prevId, nextId));
}