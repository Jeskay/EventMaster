import { VoiceChannel } from "discord.js";
import ExtendedClient from "../Client";

const likeCoolDown = 1;

function hoursDiference(date1: Date, date2: Date) {
    const diff = date1.getTime() - date2.getTime();
    return diff / 1000 / 60 / 60;
}

async function fetchPlayers(client: ExtendedClient, user1: string, user2: string) {
    const first = await client.database.getPlayer(user1);
    const second = await client.database.getPlayer(user2);
    if(!first || !second) throw Error("Cannot find the player.");
    return {first, second};
}

async function commendPlayer(client: ExtendedClient, user: string, author: string, positive: boolean, hosting: boolean) {
    if(author == user) throw Error("User can't commend himself.");
    const {first, second} = await fetchPlayers(client, user, author);
    if(hosting){
        const difference = hoursDiference(new Date, second.scoreTime);
        if(difference < likeCoolDown) throw Error(`Wait ${Math.round(difference - likeCoolDown)} hours.`);
    }
    const commend = second.commendsBy.find(commend => commend.subjectId == user && commend.host == hosting && commend.cheer == positive);
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
export const dislikePlayer = async (client: ExtendedClient, user: string, author: string) => await commendPlayer(client, user, author, false, false); 
/**
 * Creates positive feedback for player
 * @param client client instance
 * @param user user who gets feedback
 * @param author user who gives feedback
 * @returns Promise
 */
export const likePlayer = async (client: ExtendedClient, user: string, author: string) => await commendPlayer(client, user, author, true, false);
/**
 * Creates negative feedback about host
 * @param client client instance
 * @param user host who gets feedback
 * @param author user who gives feedback
 * @returns Promise
 */
export const likeHost = async (client: ExtendedClient, user: string, author: string) => await commendPlayer(client, user, author, true, true);
/**
 * Creates positive feedback about host
 * @param client client instance
 * @param user host who gets feedback
 * @param author user who gives feedback
 * @returns Promise
 */
export const dislikeHost = async (client: ExtendedClient, user: string, author: string) => await commendPlayer(client, user, author, false, true);
/**
 * Updates statistic for all voice members
 * @param client client instance
 * @param channel voice channel to update
 */
export async function updateMembers(client: ExtendedClient, channel: VoiceChannel, duration: number) {
    const server = await client.database.getServerRelations(channel.guild.id);
    const occasion = server.events.find(event => event.voiceChannel == channel.id);
    if(!occasion) throw Error("Cannot find the occasion.");
    const host = occasion.host;
    await Promise.all(channel.members.map( async (member) => {
        const player = await client.database.getPlayer(member.id);
        if(!player){
            const result = await client.database.addPlayer({
                id: member.id,
                eventsPlayed: (member.id == host) ? 0 : 1,
                eventsHosted: (member.id == host) ? 1 : 0,
                minutesPlayed: duration
            });
            await client.database.addMember({
                player: result,
                guild: server,
                eventsPlayed: result.eventsPlayed,
                eventsHosted: result.eventsHosted,
                minutesPlayed: result.minutesPlayed
            });
        } 
        else {
            let hosted= 0;
            let played = 0;
            if(player.id == host) hosted = 1;
            else played = 1;
            const user = player.membership.find(user => user.guild == server);
            if(!user) await client.database.addMember({
                player: player,
                guild: server,
                eventsPlayed: played,
                eventsHosted: hosted,
                minutesPlayed: duration
            });
            else {
                user.eventsPlayed += played;
                user.eventsHosted += hosted;
                user.minutesPlayed += duration;
                await client.database.updateMember(user);
            }
            await client.database.updatePlayer({
                id: player.id, 
                eventsPlayed: player.eventsPlayed + played,
                eventsHosted: player.eventsHosted + hosted,
                minutesPlayed: player.minutesPlayed + duration
            });
        }  
    }));
}