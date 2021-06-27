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
        const added = await database.addOccasion(member.guild.id, {
            voiceChannel: voice.id,
            textChannel: text.id,
            host: member.id,
            state: OccasionState.waiting,
            server: server
        });
        if(!added) text.send("Database Error");
    }
    /**
     * Should be called when a user joins a channel
     * @param member user, who has joined
     * @param joinedChannel channel, which has been joined
     * @returns promise
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
            text.send("The election for the event master has started!");
        }
        console.log("new member joined event");
    }
}