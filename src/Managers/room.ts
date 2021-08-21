import {GuildMember, User, CategoryChannel, VoiceState, VoiceChannel, Guild, TextChannel } from "discord.js";

export enum OccasionState{
    voting,
    waiting,
    playing
}

export enum MemberState{
    joined,
    left,
    moved,
    other
}
/*Wrap in promise */
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
    public async create(initiator: User, category: CategoryChannel){
        const voiceChnl = await category.guild.channels.create(initiator.username, {type: "GUILD_VOICE", parent: category});
        const textChnl = await category.guild.channels.create(initiator.username, {
            type: "GUILD_TEXT",
            parent: category,
            rateLimitPerUser: 30
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
        const permissions = voiceChannel.permissionsFor(user);
        console.log(`user permissions are ${permissions?.toJSON}`);
    }
    /**
     * Deletes channels from the guild
     * @param voice voice channel id
     * @param text text channel id
     */
    public async delete(guild: Guild, voice: string, text: string){
        const {voiceChannel, textChannel} = this.channels(guild, text, voice);
        await voiceChannel.delete();
        await textChannel.delete();
    }
    
    public checkState( oldState: VoiceState, newState: VoiceState){
        if(oldState.channel == newState.channel) return MemberState.other;
        if(newState.channel == null) return MemberState.left;
        if(oldState.channel == null) return MemberState.joined;
        return MemberState.moved;        
    }
}