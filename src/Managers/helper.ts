import { CategoryChannel, Channel, Guild, MessageEmbed, VoiceChannel } from "discord.js";
import { Tag } from "../entities/tag";
import ExtendedClient from "../Client";

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
        const extracted = input.substr(3, input.length - 4);
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
    /**
     * Creates a list of existing commands
     * @param client client instance
     * @returns array of lines to be printed
     */
    public commandsList(client: ExtendedClient): MessageEmbed {
        const embed = new MessageEmbed()
        .setTitle("Commands");
        client.commands.forEach(command => {
            var options: string = "";
            var line = "";
            if(command.options) options = Array.from(command.options, option => `${option.name} (${option.required ? "required" : "not required"})`).join(' ') + '\n';
            line += `${options}${command.description ?? "no description"}`;
            if(command.aliases) line += "\nAliases:" + command.aliases.join(', ');
            embed.addField(command.name, line);
        });
        return embed;
    }
    public subscriptionList(tags: Tag[]){
        var embed = new MessageEmbed()
        .setTitle("Subscriptions");
        let field = "";
        for(let i = 1;i <= tags.length; i++){
            field += ` \`${tags[i-1].title}\``;
            if(i % 3 == 0) {
                embed.addField(`${i > 2 ? i - 2 : 1}-${i}`, field);
                field = "";
            }
        }
        if(field != "") embed.addField(`${tags.length > 3 ? tags.length - 1 : 1}-${tags.length}`, field);
        return embed;
    }
    public findSubscriptions(text: string) {
        const matches = text.match('#(.*?) ') ?? [];
        return matches as Array<string>;
    }
}