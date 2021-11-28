import { GuildMember, VoiceChannel } from "discord.js";
import { Guild, TextChannel, User } from "discord.js";
import { Occasion } from "../entities/occasion";
import ExtendedClient from "../Client";
import { CommandError } from "../Error";
import { givePermissions, OccasionState } from "../Controllers";
import { findSubscriptions } from "../Utils";
import { updateMembers } from ".";
import { deleteChannels } from "./channel";
import { announcePublishedResponse, electionFinished, finishedOccasion, HostCommend, InviteMessage, notification, occasionFinished, occasionFinishResponse, occasionNotification, occasionStarted, occasionStartResponse, voteConfimation } from "../Embeds";

async function notifyPlayer(client: ExtendedClient, userId: string, title: string, description: string, channel: VoiceChannel) {
    const user = await client.users.fetch(userId);
    const invite = await channel.guild.invites.create(channel);
    const dm = user.dmChannel ?? await user.createDM();
    dm.send({
        embeds: [notification(title, description, invite.url, channel.guild.bannerURL() ?? undefined)], 
        components: [InviteMessage(invite.url, channel.guild.name)]
    });
}
/**
 * Gives channel credentials to host
 * @param client client instance
 * @param candidate user who gonna become host
 * @param voiceChannel voice channel
 */
export async function declareHost(client: ExtendedClient, occasion: Occasion, candidate: GuildMember, voiceChannel: VoiceChannel, textChannel: TextChannel) {
    client.vote.finish(voiceChannel.id);
    if(!occasion) return;
    givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, candidate);
    await client.database.updateOccasion(voiceChannel.guild.id, voiceChannel.id, {
        state: OccasionState.waiting,
        host: candidate.id
    });
    textChannel.send({embeds: [electionFinished(candidate.id)]});
}
/**
 * Performing vote for occasion host
 * @param client client instance
 * @param guild 
 * @param voterId 
 * @param candidateId 
 */
export async function vote(client: ExtendedClient, voiceChannel: VoiceChannel, voterId: string, candidateId: string) {
    const guild = voiceChannel.guild;
    const server = await client.database.getServerRelations(guild.id);
    const occasion = server.events.find(occasion => occasion.voiceChannel == voiceChannel.id);
    if(!occasion) throw new CommandError("You must be in event channel to vote.");
    if(occasion.host) throw new CommandError("There is already a host in this occasion.");
    const textChannel = voiceChannel.guild.channels.cache.get(occasion.textChannel);
    if(!textChannel || !textChannel.isText) throw new CommandError("Cannot find text channel");
    const candidate = await guild.members.fetch(candidateId);
    const finished = await client.vote.vote(voiceChannel.id, voterId, candidateId);
        if(finished){
            declareHost(client, occasion, candidate, voiceChannel as VoiceChannel, textChannel as TextChannel);
        } else await (textChannel as TextChannel).send({embeds: [voteConfimation(candidate.user.username)]});
}

/**
 * Starts a new occasion
 * @param client main client instance
 * @param guild occasion guild
 * @param author occasion host
 * @param title occasion title
 * @param description occasion description
 */
export async function start(client: ExtendedClient, guild: Guild, author: User, title: string, description: string){
    const server = await client.database.getServerRelations(guild.id);
    const occasion = server.events.find(event => event.host == author.id);
    if(!occasion) throw Error("Only host has permission to start an event");
    if(occasion.state == OccasionState.playing) throw new CommandError("Occasion has already started.");
    if(!title) throw Error("Event name must be provided");
    await client.database.updateOccasion(guild.id, occasion.voiceChannel, {
        Title: title, 
        startedAt: new Date,
        state: OccasionState.playing,
        description: description
    });
    // Logging
    if(server.settings.logging_channel) {
        const channel = guild.channels.cache.get(server.settings.logging_channel);
        if(!channel || !channel.isText) return occasionFinishResponse(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
        const voiceChannel = guild.channels.cache.get(occasion.voiceChannel) as VoiceChannel;
        if(!voiceChannel) throw Error("Cannot find voice channel");
        await (channel as TextChannel).send({embeds: [occasionStarted(title, description, author.username, voiceChannel.members.size)]});
    }
    return occasionStartResponse(title, description);
}
/**
 * Finishes current occasion
 * @param client main client instance
 * @param guild occasion title
 * @param author occasion host
 * @param results results to print in logs
 */
export async function finish(client: ExtendedClient, guild: Guild, author: User, results: string) {
    const server = await client.database.getServerRelations(guild.id);
    const occasion = server.events.find(event => event.host == author.id);
    if(!occasion) throw Error("Only host has permission to finish an event");
    const voice = guild.channels.cache.get(occasion.voiceChannel);
    const text = guild.channels.cache.get(occasion.textChannel);
    if(!text) throw Error("Text channel has been removed, personal statistic will not be updated.");
    if(!voice) throw Error("Voice channel has been removed, personal statistic will not be updated.");
    const duration = (new Date()).getMinutes() - occasion.startedAt.getMinutes();
    await updateMembers(client, voice as VoiceChannel, duration);
    await client.database.removeOccasion(server.guild, occasion.voiceChannel);
    // Closing event
    await (text as TextChannel).send({embeds: [finishedOccasion], components: [HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`)]});
    setTimeout(() => deleteChannels(client, server, guild, occasion.voiceChannel, occasion.textChannel), 10000);
    //logging 
    if(server.settings.logging_channel) {
        const channel = guild.channels.cache.get(server.settings.logging_channel);
        if(!channel || !channel.isText) return occasionFinishResponse(occasion.Title, (new Date()).getMinutes() - occasion.startedAt.getMinutes());
        (channel as TextChannel).send({embeds: [occasionFinished(occasion.Title, results, author.username, duration, (voice as VoiceChannel).members.size)]});
    }
    return occasionFinishResponse(occasion.Title, duration);
}
/**
 * Announce the occasion
 * @param client main client instance
 * @param title occasion title
 * @param description occasion description with hashtags
 * @param guild occasion guild
 * @param author occasion host
 */
export async function announce(client: ExtendedClient,  description: string, guild: Guild, author: User, title?: string, image?: string){
    const server = await client.database.getServerRelations(guild.id);
    const occasion = server.events.find(event => event.host == author.id);
    if(!occasion) throw Error("Only host has permission to announce an event.");
    if(occasion.announced) throw new CommandError("Announce has been already published.");
    if(!server.settings.notification_channel) throw Error("Notification channel was not set up.");
    const channel = guild.channels.cache.get(server.settings.notification_channel);
    const voiceChannel = await guild.channels.fetch(occasion.voiceChannel);
    if(!(voiceChannel instanceof VoiceChannel)) throw new CommandError("Voice channel does not exist.");
    const hashtags = findSubscriptions(description);
    if(!channel || !channel.isText) throw Error("Cannot find notification channel.");
    const eventRole = server.settings.event_role;
    await (channel as TextChannel).send({
        content: eventRole ? `<@&${eventRole}>` : "",
         embeds:[occasionNotification(title, description, author.username, image)]
    });
    if(hashtags.length > 0) {
        hashtags.forEach(tag => {
            notifyPlayers(client, tag, voiceChannel, title ?? tag, description);
        });
    }
    await client.database.updateOccasion(server.guild, occasion.voiceChannel , {
        announced: true
    });
    return announcePublishedResponse(hashtags);
}
/**
 * Sends personal notifications about occasion
 * @param client main client instance
 * @param tagId occasion tag
 * @param channel occasion voice channel
 * @param title occasion title
 * @param description occasion description
 */
export async function notifyPlayers(client: ExtendedClient, tagId: string, channel: VoiceChannel, title: string, description: string) {
    const tag = await client.database.getTag(tagId);
    if(!tag) return;
    const players = await tag.subscribers;
    console.log(channel.guild);
    await Promise.all(players.map(async (player) => 
        await notifyPlayer(client, player.id, title, description, channel))
    );
}