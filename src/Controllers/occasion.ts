import { GuildChannel, GuildMember, VoiceChannel } from "discord.js";
import { Guild, TextChannel, User } from "discord.js";
import { Occasion } from "../entities/occasion";
import ExtendedClient from "../Client";
import { CommandError } from "../Error";
import { OccasionState } from "../Managers/room";

export class OccasionController {
    private async notifyPlayer(client: ExtendedClient, userId: string, title: string, description: string, channel: GuildChannel) {
        const user = await client.users.fetch(userId);
        const invite = await channel.guild.invites.create(channel);
        const dm = user.dmChannel ?? await user.createDM();
        dm.send({
            embeds: [client.embeds.notification(title, description, invite.url, channel.guild.bannerURL() ?? undefined)], 
            components: [client.embeds.InviteMessage(invite.url, channel.guild.name)]
        });
    }
    /**
     * Gives channel credentials to host
     * @param client client instance
     * @param candidate user who gonna become host
     * @param voiceChannel voice channel
     */
     private async DeclareHost(client: ExtendedClient, occasion: Occasion, candidate: GuildMember, voiceChannel: VoiceChannel, textChannel: TextChannel) {
        client.vote.finish(voiceChannel.id);
        if(!occasion) return;
        client.room.givePermissions(voiceChannel.guild, occasion.textChannel, occasion.voiceChannel, candidate);
        await client.database.updateOccasion(voiceChannel.guild.id, voiceChannel.id, {
            state: OccasionState.playing,
            host: candidate.id
        });
        textChannel.send({embeds: [client.embeds.electionFinished(candidate.user.username)]});
    }
    /**
     * Performing vote for occasion host
     * @param client client instance
     * @param guild 
     * @param voterId 
     * @param candidateId 
     */
    public async Vote(client: ExtendedClient, voiceChannel: VoiceChannel, voterId: string, candidateId: string) {
        const guild = voiceChannel.guild;
        const server = await client.database.getServerRelations(guild.id);
        const occasion = server.events.find(occasion => occasion.voiceChannel == voiceChannel.id);
        if(!occasion) throw new CommandError("You must be in event channel to vote.");
        if(occasion.host) throw new CommandError("There is already a host in this occasion.");
        const textChannel = voiceChannel.guild.channels.cache.get(occasion.textChannel);
        if(!textChannel || !textChannel.isText) throw new CommandError("Cannot find text channel");
        const candidate = await guild.members.fetch(candidateId);
        const finished = await client.vote.vote(voiceChannel.id, voterId, candidateId);
            if(finished){
                client.occasionController.DeclareHost(client, occasion, candidate, voiceChannel as VoiceChannel, textChannel as TextChannel);
            } else await (textChannel as TextChannel).send({embeds: [client.embeds.voteConfimation(candidate.user.username)]});

    }
    
    /**
     * Starts a new occasion
     * @param client main client instance
     * @param guild occasion guild
     * @param author occasion host
     * @param title occasion title
     * @param description occasion description
     */
    public async Start(client: ExtendedClient, guild: Guild, author: User, title: string, description: string){
        const server = await client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if(!occasion) throw Error("Only host has permission to start an event");
        if(!title) throw Error("Event name must be provided");
        await client.database.updateOccasion(guild.id, occasion.voiceChannel, {
            Title: title, 
            startedAt: new Date,
            description: description
        });
        // Logging
        if(server.settings.logging_channel) {
            const channel = guild.channels.cache.get(server.settings.logging_channel);
            if(!channel || !channel.isText) return;
            const voiceChannel = guild.channels.cache.get(occasion.voiceChannel) as VoiceChannel;
            if(!voiceChannel) throw Error("Cannot find voice channel");
            await (channel as TextChannel).send({embeds: [client.embeds.occasionStarted(title, description, author.username, voiceChannel.members.size)]});
        }
    }
    /**
     * Finishes current occasion
     * @param client main client instance
     * @param guild occasion title
     * @param author occasion host
     * @param results results to print in logs
     */
    public async Finish(client: ExtendedClient, guild: Guild, author: User, results: string) {
        const server = await client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if(!occasion) throw Error("Only host has permission to finish an event");
        const voice = guild.channels.cache.get(occasion.voiceChannel);
        const text = guild.channels.cache.get(occasion.textChannel);
        if(!text) throw Error("Text channel has been removed, personal statistic will not be updated.");
        if(!voice) throw Error("Voice channel has been removed, personal statistic will not be updated.");
        await client.ratingController.updateMembers(client, voice as VoiceChannel);
        await client.database.removeOccasion(server.guild, occasion.voiceChannel);
        await (text as TextChannel).send({embeds: [client.embeds.finishedOccasion], components: [client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`)]});
        setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
        //logging 
        if(server.settings.logging_channel) {
            const channel = guild.channels.cache.get(server.settings.logging_channel);
            if(!channel || !channel.isText) return;
            (channel as TextChannel).send({embeds: [client.embeds.occasionFinished(results, author.username, (voice as VoiceChannel).members.size)]});
        }
    }
    /**
     * Announce the occasion
     * @param client main client instance
     * @param title occasion title
     * @param description occasion description with hashtags
     * @param guild occasion guild
     * @param author occasion host
     */
    public async Announce(client: ExtendedClient,  description: string, guild: Guild, author: User, title?: string, image?: string){
        const server = await client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if(!occasion) throw Error("Only host has permission to start an event.");
        if(!server.settings.notification_channel) throw Error("Notification channel was not set up.");
        const channel = guild.channels.cache.get(server.settings.notification_channel);
        const hashtags = client.helper.findSubscriptions(description);
        if(!channel || !channel.isText) throw Error("Cannot find notification channel.");
        const eventRole = server.settings.event_role;
        await (channel as TextChannel).send({
            content: eventRole ? `<@&${eventRole}>` : "",
             embeds:[client.embeds.occasionNotification(title, description, author.username, image)]
        });
        if(hashtags.length > 0) {
            hashtags.forEach(tag => {
                this.NotifyPlayers(client, tag, channel as GuildChannel, title ?? tag, description);
            });
        }
    }
    /**
     * Sends personal notifications about occasion
     * @param client main client instance
     * @param tagId occasion tag
     * @param channel occasion voice channel
     * @param title occasion title
     * @param description occasion description
     */
    public async NotifyPlayers(client: ExtendedClient, tagId: string, channel: GuildChannel, title: string, description: string) {
        const tag = await client.database.getTag(tagId);
        if(!tag) return;
        const players = await tag.subscribers;
        await Promise.all(players.map(async (player) => 
            await this.notifyPlayer(client, player.id, title, description, channel))
        );
    }
}