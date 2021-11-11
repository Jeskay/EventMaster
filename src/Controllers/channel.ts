import { OccasionState, RoomManger } from "../Managers/room";
import { DataBaseManager } from "../Managers/database";
import { CategoryChannel, GuildMember, TextChannel, VoiceChannel } from "discord.js";
import { Server } from "../entities/server";
import ExtendedClient from "../Client";

async function createChannelJoined(member: GuildMember, server: Server, database: DataBaseManager, room: RoomManger, joinedChannel: VoiceChannel){
    const channel = member.guild.channels.cache.get(server.eventCategory) as CategoryChannel;
    if(channel == undefined) return;
    const {voice, text} = await room.create(member.user, channel, server.settings.black_list);
    if(member.guild.channels.cache.size >= 499) throw new Error("Channel limit reached");
    if(server.settings.occasion_limit && server.events.length + 1 >= server.settings.occasion_limit)
        await joinedChannel.permissionOverwrites.edit(member.guild.roles.everyone, {'CONNECT': false});
    await member.voice.setChannel(voice).catch(() => {
        room.delete(voice.guild, voice.id, text.id);
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
        await createChannelJoined(member, server, client.database, client.room, joinedChannel);
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
        await text.send({embeds: [client.embeds.voting]});
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
        await client.room.delete(leftChannel.guild, occasion.voiceChannel, occasion.textChannel);
        if(server.settings.occasion_limit && server.settings.occasion_limit == server.events.length) {
            const joinChannel = await client.channels.fetch(server.eventChannel) as VoiceChannel;
            await joinChannel.permissionOverwrites.edit(leftChannel.guild.roles.everyone, {'CONNECT': true});
        }
    }
}
