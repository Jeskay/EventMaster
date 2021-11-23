import { CommandInteraction, Guild, TextBasedChannels, User, VoiceChannel } from 'discord.js';
import { List } from '../../Utils';
import ExtendedClient from '../../Client';
import { CommandError } from '../../Error';
import { checkChannel, ratingList, subscriptionList } from '../../Utils';
import * as Controller from '../../Controllers';
import { playerCommended, ListMessage, Profiles, playerInfo, subscribed, unsubscribed, voteConfimation } from '../../Embeds';

export async function dislike(client: ExtendedClient, author: User, user: User) {
    await Controller.dislikePlayer(client, user.id, author.id);
    return playerCommended(user);
}

export async function like(client: ExtendedClient, author: User, user: User) {
    await Controller.likePlayer(client, user.id, author.id);
    return playerCommended(user);
}

export async function help(client: ExtendedClient, author: User, channel: TextBasedChannels) {
    const prevId = `previousPage.${author.id} help`;
    const nextId = `nextPage.${author.id} help`;
    const list = client.lists.get('help');
    if(!list) throw new CommandError('Command list not found.');
    await list.create(channel, ListMessage(prevId, nextId));
}

export async function profile(client: ExtendedClient, user: User, guild?: Guild) {
    const profile = await client.database.getPlayer(user.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const row = Profiles(false, user.id, guild ? guild.id : undefined);
    const embed = playerInfo(profile, user, profile.commendsAbout);
    return {embeds: [embed], components: [row], ephemeral: true};
}

export async function subscribe(client: ExtendedClient, author: User, title: string) {
    const profile = await client.database.getPlayer(author.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const tags = await profile.subscriptions;
    if(tags.find(tag => tag.title == title)) throw new CommandError("You are already subscribed for this tag.");
    var tag = await client.database.getTag(title) ?? client.database.tag({title: title});
    await client.database.addTag(tag);
    tags.push(tag);
    profile.subscriptions = Promise.resolve(tags);
    await client.database.updatePlayer(profile);
    return subscribed(tag.title);
}

export async function unsubscribe(client: ExtendedClient, author: User, title: string) {
    const profile = await client.database.getPlayer(author.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const tags = await profile.subscriptions;
    if(!tags.find(tag => tag.title == title)) throw new CommandError("You are not subscribed for this tag.");
    await client.database.removeTag(title);
    return unsubscribed(title);
}

export async function subscriptions(client: ExtendedClient, author: User, channel: TextBasedChannels | CommandInteraction) {
    const profile = await client.database.getPlayer(author.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const subId = `subs${author.id}`;
    if(client.lists.get(subId)) client.lists.delete(subId);
    const tags = await profile.subscriptions;
    if(tags.length < 1) throw new CommandError("You have no subscriptions.");
    const list = new List(30, subscriptionList(tags), 5);
    client.lists.set(subId, list);
    const prevId = `previousPage.${author.id} ${subId}`;
    const nextId = `nextPage.${author.id} ${subId}`;
    list.create(channel, ListMessage(prevId, nextId));
}
export async function vote(client: ExtendedClient, author: User, candidate: User) {
    if(author.id == candidate.id) throw new CommandError("You can't vote for yourself.");
    const voiceChannel = client.channels.cache.find(channel => checkChannel(author.id, candidate.id, channel)) as VoiceChannel;
    if(!voiceChannel) throw new CommandError("Both voter and candidate must be in occasion channel.");
    await Controller.vote(client, voiceChannel, author.id, candidate.id);
    return voteConfimation(candidate.username);
}
export async function playerRating(client: ExtendedClient, author: User, channel: TextBasedChannels | CommandInteraction) {
    const rating = await client.database.getRanking();
    const rateId = `rate${author.id}`;
    if(client.lists.get(rateId)) client.lists.delete(rateId);
    const list = new List(30, ratingList(rating), 5);
    client.lists.set(rateId, list);
    const prevId = `previousPage.${author.id} ${rateId}`;
    const nextId = `nextPage.${author.id} ${rateId}`;
    list.create(channel, ListMessage(prevId, nextId));
}