import { GuildChannel, VoiceChannel } from "discord.js";
import { Guild, TextChannel, User } from "discord.js";
import ExtendedClient from "src/Client";

export class OccasionController {
    private async notifyPlayer(client: ExtendedClient, userId: string, title: string, description: string, channel: GuildChannel) {
        const user = await client.users.fetch(userId);
        const invite = await channel.createInvite();
        const dm = user.dmChannel ?? await user.createDM();
        dm.send(client.embeds.notification(title, description, invite.url));
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
            await (channel as TextChannel).send(client.embeds.occasionStarted(title, description, author.username, voiceChannel.members.size));
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
        await (text as TextChannel).send(client.embeds.finishedOccasion, client.embeds.HostCommend(`likeHost.${occasion.host}`, `dislikeHost.${occasion.host}`));
        setTimeout(() => client.room.delete(guild, occasion.voiceChannel, occasion.textChannel), 10000);
        //logging 
        if(server.settings.logging_channel) {
            const channel = guild.channels.cache.get(server.settings.logging_channel);
            if(!channel || !channel.isText) return;
            (channel as TextChannel).send(client.embeds.occasionFinished(results, author.username, voice.members.size));
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
    public async Announce(client: ExtendedClient, title: string, description: string, guild: Guild, author: User){
        const server = await client.database.getServerRelations(guild.id);
        const occasion = server.events.find(event => event.host == author.id);
        if(!occasion) throw Error("Only host has permission to start an event.");
        if(!server.settings.notification_channel) throw Error("Notification channel was not set up.");
        const channel = guild.channels.cache.get(server.settings.notification_channel);
        const hashtags = client.helper.findSubscriptions(description);
        if(!channel || !channel.isText) throw Error("Cannot find notification channel.");
        await (channel as TextChannel).send(client.embeds.occasionNotification(title, description, author.username));
        if(hashtags.length > 0) {
            hashtags.forEach(tag => {
                this.NotifyPlayers(client, tag, channel, title, description);
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
        if(!tag) throw Error("There are no subscriptions for this tag");
        const players = await tag.subscribers;
        await Promise.all(players.map(async (player) => 
            await this.notifyPlayer(client, player.id, title, description, channel))
        );
    }
}