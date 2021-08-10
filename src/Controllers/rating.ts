import { VoiceChannel } from "discord.js";
import ExtendedClient from "../Client";

export class RatingController {
    private likeCoolDown = 1;
    
    private hoursDiference(date1: Date, date2: Date) {
        const diff = date1.getTime() - date2.getTime();
        return diff / 1000 / 60 / 60;
    }
    private async fetchPlayers(client: ExtendedClient, user1: string, user2: string) {
        const first = await client.database.getPlayer(user1);
        const second = await client.database.getPlayer(user2);
        if(!first || !second) throw Error("Cannot find the player.");
        return {first, second};
    }
    private async commendPlayer(client: ExtendedClient, user: string, author: string, positive: boolean, hosting: boolean) {
        if(author == user) throw Error("User can't commend himself.");
        const {first, second} = await this.fetchPlayers(client, user, author);
        if(hosting){
            const difference = this.hoursDiference(new Date, second.scoreTime);
            if(difference < this.likeCoolDown) throw Error(`Wait ${Math.round(difference - this.likeCoolDown)} hours.`);
        }
        const commendsBy = await second.commendsBy;
        console.log(commendsBy);
        const commend = commendsBy.find(commend => commend.subjectId == user && commend.host == hosting && commend.cheer == positive);
        if(commend) {
            await client.database.updateCommend(commend, {
                duplicates: commend.duplicates + 1,
            });
        } 
        else await client.database.addCommend({
            authorId: author,
            subjectId: user,
            author: second,
            subject: first,
            host: hosting,
            cheer: positive,
            duplicates: 1
        });
    }
    /**
     * Creates negative feedback for player
     * @param client client instance
     * @param user user who gets feedback
     * @param author user who gives feedback
     * @returns Promise
     */
    public DislikePlayer = async (client: ExtendedClient, user: string, author: string) => await this.commendPlayer(client, user, author, false, false); 
    /**
     * Creates positive feedback for player
     * @param client client instance
     * @param user user who gets feedback
     * @param author user who gives feedback
     * @returns Promise
     */
    public LikePlayer = async (client: ExtendedClient, user: string, author: string) => await this.commendPlayer(client, user, author, true, false);
    /**
     * Creates negative feedback about host
     * @param client client instance
     * @param user host who gets feedback
     * @param author user who gives feedback
     * @returns Promise
     */
    public likeHost = async (client: ExtendedClient, user: string, author: string) => await this.commendPlayer(client, user, author, true, true);
    /**
     * Creates positive feedback about host
     * @param client client instance
     * @param user host who gets feedback
     * @param author user who gives feedback
     * @returns Promise
     */
    public dislikeHost = async (client: ExtendedClient, user: string, author: string) => await this.commendPlayer(client, user, author, false, true);
    /**
     * Updates statistic for all voice members
     * @param client client instance
     * @param channel voice channel to update
     */
    public async updateMembers(client: ExtendedClient, channel: VoiceChannel) {
        const server = await client.database.getServerRelations(channel.guild.id);
        const occasion = server.events.find(event => event.voiceChannel == channel.id);
        if(!occasion) throw Error("Cannot find the occasion.");
        const host = occasion.host;
        await Promise.all(channel.members.map( async (member) => {
            const player = await client.database.getPlayer(member.id);
            if(!player) await client.database.addPlayer({
                id: member.id,
                eventsPlayed: (member.id == host) ? 0 : 1,
                eventsHosted: (member.id == host) ? 1 : 0,
            });
            else await client.database.updatePlayer({
                id: member.id, 
                eventsPlayed: (member.id == host) ? player.eventsPlayed : player.eventsPlayed + 1,
                eventsHosted: (member.id == host) ? player.eventsHosted + 1 : player.eventsHosted
            }); 
        }));
    }
}