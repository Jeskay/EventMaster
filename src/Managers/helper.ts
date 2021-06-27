import { Channel, VoiceChannel } from "discord.js";

export class HelperManager{
    public extractID(input: string){
        console.log(input);
        const extracted = input.substr(2, input.length - 3);
        console.log(extracted);
        return extracted;
    }
    /**
     * 
     * @param member1 first member of the channel
     * @param member2 second member of the channel
     * @param channel channel to check
     * @returns true if the channel contains given members
     */
    public checkChannel(member1 : string, member2: string, channel: Channel): boolean{
        if(channel.type != "voice") return false;
        if(!(channel as VoiceChannel).members.has(member1)) return false;
        if(!(channel as VoiceChannel).members.has(member2)) return false;
        return true;
    }
}