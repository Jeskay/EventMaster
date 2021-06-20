import { User, CategoryChannel, VoiceState, VoiceChannel, Guild, TextChannel } from "discord.js";

export enum OccasionState{
    voting,
    waiting,
    playing
}

export enum MemberState{
    joined,
    left,
    other
}
/*Wrap in promise */
export class RoomManger {
    public async create(initiator: User, category: CategoryChannel){
        const voiceChnl = await category.guild.channels.create(initiator.username, {type: "voice", parent: category});
        const textChnl = await category.guild.channels.create(initiator.username, {type: "text", parent: category});
        return {voice: voiceChnl, text: textChnl};
    }
    public async delete(guild: Guild, voice: string, text: string){
        const voiceChannel = guild.channels.cache.get(voice) as VoiceChannel;
        const textChannel = guild.channels.cache.get(text) as TextChannel;
        await voiceChannel.delete();
        await textChannel.delete();
    }
    public checkState(oldState: VoiceState, newState: VoiceState){
        if(oldState.channel == newState.channel) return MemberState.other;
        if(oldState.channel == null) return MemberState.joined;
        return MemberState.left;        
    }
}