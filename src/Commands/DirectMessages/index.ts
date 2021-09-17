import { CommandInteraction, TextBasedChannels, User, VoiceChannel } from 'discord.js';
import { List } from '../../List';
import ExtendedClient from '../../Client';
import { CommandError } from '../../Error';

export async function dislike(client: ExtendedClient, author: User, user: User) {
    await client.ratingController.dislikePlayer(client, user.id, author.id);
    return client.embeds.playerCommended(user);
}

export async function like(client: ExtendedClient, author: User, user: User) {
    await client.ratingController.likePlayer(client, user.id, author.id);
    return client.embeds.playerCommended(user);
}

export async function help(client: ExtendedClient, author: User, channel: TextBasedChannels) {
    const prevId = `previousPage.${author.id} help`;
    const nextId = `nextPage.${author.id} help`;
    const list = client.lists.get('help');
    if(!list) throw new CommandError('Command list not found.');
    await list.create(channel, client.embeds.ListMessage(prevId, nextId));
}

export async function profile(client: ExtendedClient, user: User) {
    const profile = await client.database.getPlayer(user.id);
    if(!profile) throw new CommandError("This user did not join events.");
    return client.embeds.playerInfo(profile, user, profile.commendsAbout);
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
    return client.embeds.subscribed(tag.title);
}

export async function unsubscribe(client: ExtendedClient, author: User, title: string) {
    const profile = await client.database.getPlayer(author.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const tags = await profile.subscriptions;
    if(!tags.find(tag => tag.title == title)) throw new CommandError("You are not subscribed for this tag.");
    await client.database.removeTag(title);
    return client.embeds.unsubscribed(title);
}

export async function subscriptions(client: ExtendedClient, author: User, channel: TextBasedChannels | CommandInteraction) {
    const profile = await client.database.getPlayer(author.id);
    if(!profile) throw new CommandError("This user did not join events.");
    const subId = `subs${author.id}`;
    if(client.lists.get(subId)) client.lists.delete(subId);
    const tags = await profile.subscriptions;
    if(tags.length < 1) throw new CommandError("You have no subscriptions.");
    const list = new List(30, client.helper.subscriptionList(tags), 5);
    client.lists.set(subId, list);
    const prevId = `previousPage.${author.id} ${subId}`;
    const nextId = `nextPage.${author.id} ${subId}`;
    list.create(channel, client.embeds.ListMessage(prevId, nextId));
}
export async function vote(client: ExtendedClient, author: User, candidate: User) {
    if(author.id == candidate.id) throw new CommandError("You can't vote for yourself.");
    const voiceChannel = client.channels.cache.find(channel => client.helper.checkChannel(author.id, candidate.id, channel)) as VoiceChannel;
    if(!voiceChannel) throw new CommandError("Both voter and candidate must be in occasion channel.");
    await client.occasionController.vote(client, voiceChannel, author.id, candidate.id);
    return client.embeds.voteConfimation(candidate.username);
}
export async function playerRating(client: ExtendedClient, author: User, channel: TextBasedChannels | CommandInteraction) {
    const rating = await client.database.getRanking();
    const rateId = `rate${author.id}`;
    if(client.lists.get(rateId)) client.lists.delete(rateId);
    const list = new List(30, client.helper.ratingList(rating), 5);
    client.lists.set(rateId, list);
    const prevId = `previousPage.${author.id} ${rateId}`;
    const nextId = `nextPage.${author.id} ${rateId}`;
    list.create(channel, client.embeds.ListMessage(prevId, nextId));
}