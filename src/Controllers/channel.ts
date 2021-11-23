import { DataBaseManager } from "../Managers/database";
import { CategoryChannel, Guild, GuildMember, OverwriteResolvable, TextChannel, User, VoiceChannel, VoiceState, Permissions } from "discord.js";
import { Server } from "../entities/server";
import ExtendedClient from "../Client";
import { voting } from "../Embeds";

export enum OccasionState{
    voting,
    waiting,
    playing,
    finished
}

export enum MemberState{
    joined,
    left,
    moved,
    other
}
export function channels(guild: Guild, text: string, voice: string){
    const voiceChannel = guild.channels.cache.get(voice) as VoiceChannel;
    const textChannel = guild.channels.cache.get(text) as TextChannel;
    return { voiceChannel, textChannel};
}
/**
 * Creates voice and text channels for an occasion
 * @param initiator user who initiated an occasion
 * @param category category channel where channels will be created
 * @returns an object with text and voice channels
 */
export async function createChannels(initiator: User, category: CategoryChannel, blacklist: string[]){
    let text_permissions: OverwriteResolvable[] = [];
    let voice_permissions: OverwriteResolvable[] = [];
    blacklist.forEach(user => {
        text_permissions.push({
            type: 'member',
            id: user,
            deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
        });
        voice_permissions.push({
            type: 'member',
            id: user,
            deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT]
        });
    });
    const voiceChnl = await category.guild.channels.create(initiator.username, {
        type: "GUILD_VOICE", 
        parent: category,
        permissionOverwrites: voice_permissions
    });
    const textChnl = await category.guild.channels.create(initiator.username, {
        type: "GUILD_TEXT",
        parent: category,
        rateLimitPerUser: 30,
        permissionOverwrites: text_permissions
    });
    return {voice: voiceChnl, text: textChnl};
}
/**
 * Gives a user administrator permissions in provided text and voice channels
 * @param guild guild where channels are located
 * @param text text channel id
 * @param voice voice channel id
 * @param user user, to give permissions
 */
export async function givePermissions(guild: Guild, text: string, voice: string, user: GuildMember){
    const {voiceChannel, textChannel} = channels(guild, text, voice);
    await voiceChannel.permissionOverwrites.edit(user, {
        MANAGE_CHANNELS:true
    });
    await textChannel.permissionOverwrites.edit(user, {
        MANAGE_CHANNELS: true
    });
}
/**
 * Deletes channels from the guild
 * @param voice voice channel id
 * @param text text channel id
 */
export async function deleteChannels(client: ExtendedClient, server: Server, guild: Guild, voice: string, text: string) {
    const {voiceChannel, textChannel} = channels(guild, text, voice);
    await voiceChannel.delete();
    await textChannel.delete();
    if(server.settings.occasion_limit && (server.settings.occasion_limit == server.events.length)) {
        const joinChannel = await client.channels.fetch(server.eventChannel) as VoiceChannel;
        await joinChannel.permissionOverwrites.edit(guild.roles.everyone, {'CONNECT': true});
    }
}

/**@returns channel's state */
export function checkState( oldState: VoiceState, newState: VoiceState){
    if(oldState.channel == newState.channel) return MemberState.other;
    if(newState.channel == null) return MemberState.left;
    if(oldState.channel == null) return MemberState.joined;
    return MemberState.moved;        
}

async function createChannelJoined(client: ExtendedClient, member: GuildMember, server: Server, database: DataBaseManager, joinedChannel: VoiceChannel){
    const channel = member.guild.channels.cache.get(server.eventCategory) as CategoryChannel;
    if(channel == undefined) return;
    const {voice, text} = await createChannels(member.user, channel, server.settings.black_list);
    if(member.guild.channels.cache.size >= 499) throw new Error("Channel limit reached");
    if(server.settings.occasion_limit && server.events.length + 1 >= server.settings.occasion_limit)
        await joinedChannel.permissionOverwrites.edit(member.guild.roles.everyone, {'CONNECT': false});
    await member.voice.setChannel(voice).catch(() => {
        deleteChannels(client, server, voice.guild, voice.id, text.id);
        return;
    });
    await database.addOccasion(member.guild.id, {
        voiceChannel: voice.id,
        textChannel: text.id,
        initiator: member.id,
        state: OccasionState.waiting,
        announced: false,
        server: server
    });
}
/**
 * Should be called when a user joins a channel
 * @param member user, who has joined
 * @param joinedChannel channel, which has been joined
 * @returns Promise
 */
export async function joinHandler(client: ExtendedClient, member: GuildMember, joinedChannel: VoiceChannel){
    const server = await client.database.getServerRelations(member.guild.id);
    if(server == null) return;
    if(server.eventChannel == joinedChannel.id){ 
        await createChannelJoined(client, member, server, client.database, joinedChannel);
        return;
    }
    const occasion = server.events.find(event => event.voiceChannel == joinedChannel.id);
    if(occasion == undefined) return;
    if(occasion.host) return;
    if(joinedChannel.members.size >= server.settings.limit){
        const text = joinedChannel.guild.channels.cache.get(occasion.textChannel) as TextChannel;
        if(text == undefined || !text.isText) return;
        client.vote.start(occasion.voiceChannel, server.settings.limit);
        await client.database.updateOccasion(joinedChannel.guild.id, joinedChannel.id, {
            state: OccasionState.voting
        });
        await text.send({embeds: [voting(server.settings.limit)]});
    }
}
/**
 * Should be called when a user lefts a channel
 * @param leftChannel channel, which has been left
 * @returns Promise
 */
export async function leftHandler(client: ExtendedClient, leftChannel: VoiceChannel) {
    const server = await client.database.getServerRelations(leftChannel.guild.id);
    if(!server) return;
    const occasion = server.events.find(event => event.voiceChannel == leftChannel.id);
    if(!occasion) return;
    if(leftChannel != null && leftChannel.members.size == 0){
        await client.database.removeOccasion(leftChannel.guild.id, occasion.voiceChannel);
        await deleteChannels(client, server, leftChannel.guild, occasion.voiceChannel, occasion.textChannel);
    }
}
