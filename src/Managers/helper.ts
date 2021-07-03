import { CategoryChannel, Channel, Guild, VoiceChannel } from "discord.js";

export class HelperManager{
    /**
     * Resolves when given channel is located in category and guild
     */
    public validatePair(channelID: string, categoryID: string, guild: Guild) {
            const channel = guild.channels.cache.get(channelID);
            const category = guild.channels.cache.get(categoryID) as CategoryChannel;
            if(!channel) throw Error("Cannot find the channel.");
            if(!category) throw Error("Cannot find the category.");
            if(!category.children.has(channelID)) throw Error(`Channel ${channel.name} is not in ${category.name}.`);
    }
    /**
     * extracts ID from link
     * @param input link without extra characters
     * @returns id
     */
    public extractID(input: string){
        console.log(input);
        const extracted = input.substr(3, input.length - 4);
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