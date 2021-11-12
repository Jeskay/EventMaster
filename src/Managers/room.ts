import {GuildMember, User, CategoryChannel, VoiceState, VoiceChannel, Guild, TextChannel, OverwriteResolvable, Permissions } from "discord.js";
import ExtendedClient from "../Client";
import { Server } from "../entities/server";

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

export class RoomManger {
    private channels(guild: Guild, text: string, voice: string){
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
    public async create(initiator: User, category: CategoryChannel, blacklist: string[]){
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
    public async givePermissions(guild: Guild, text: string, voice: string, user: GuildMember){
        const {voiceChannel, textChannel} = this.channels(guild, text, voice);
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
    public async delete(client: ExtendedClient, server: Server, guild: Guild, voice: string, text: string){
        const {voiceChannel, textChannel} = this.channels(guild, text, voice);
        await voiceChannel.delete();
        await textChannel.delete();
        if(server.settings.occasion_limit && (server.settings.occasion_limit == server.events.length)) {
            const joinChannel = await client.channels.fetch(server.eventChannel) as VoiceChannel;
            await joinChannel.permissionOverwrites.edit(guild.roles.everyone, {'CONNECT': true});
        }
    }
    /**@returns channel's state */
    public checkState( oldState: VoiceState, newState: VoiceState){
        if(oldState.channel == newState.channel) return MemberState.other;
        if(newState.channel == null) return MemberState.left;
        if(oldState.channel == null) return MemberState.joined;
        return MemberState.moved;        
    }
}