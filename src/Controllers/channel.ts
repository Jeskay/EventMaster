import { OccasionState, RoomManger } from "../Managers/room";
import { DataBaseManager } from "../Managers/database";
import { CategoryChannel, GuildMember, TextChannel, VoiceChannel } from "discord.js";
import { Server } from "../entities/server";
import ExtendedClient from "../Client";

export class ChannelController {

    private async createChannelJoined(member: GuildMember, server: Server, database: DataBaseManager, room: RoomManger){
        const channel = member.guild.channels.cache.get(server.eventCategory) as CategoryChannel;
        if(channel == undefined) return;
        const {voice, text} = await room.create(member.user, channel);
        await member.voice.setChannel(voice);
        /*Add text channel greeting*/
        await database.addOccasion(member.guild.id, {
            voiceChannel: voice.id,
            textChannel: text.id,
            initiator: member.id,
            state: OccasionState.waiting,
            server: server
        });
    }
    /**
     * Should be called when a user joins a channel
     * @param member user, who has joined
     * @param joinedChannel channel, which has been joined
     * @returns Promise
     */
    public async joinHandler(client: ExtendedClient, member: GuildMember, joinedChannel: VoiceChannel){
        const server = await client.database.getServerRelations(member.guild.id);
        if(server == null) return;
        if(server.eventChannel == joinedChannel.id){ 
            await this.createChannelJoined(member, server, client.database, client.room);
            return;
        }
        const occasion = server.events.find(event => event.voiceChannel == joinedChannel.id);
        if(occasion == undefined) return;
        if(joinedChannel.members.size >= server.settings.limit){
            const text = joinedChannel.guild.channels.cache.get(occasion.textChannel) as TextChannel;
            if(text == undefined || !text.isText) return;
            client.vote.start(occasion.voiceChannel, 1);//change to limit
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
    public async leftHandler(client: ExtendedClient, leftChannel: VoiceChannel) {
        const server = await client.database.getServerRelations(leftChannel.guild.id);
        if(!server) return;
        const occasion = server.events.find(event => event.voiceChannel == leftChannel.id);
        if(!occasion) return;
        if(leftChannel != null && leftChannel.members.size == 0){
            await client.database.removeOccasion(leftChannel.guild.id, occasion.voiceChannel);
            await client.room.delete(leftChannel.guild, occasion.voiceChannel, occasion.textChannel);
        }
    }
}