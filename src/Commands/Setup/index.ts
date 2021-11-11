import { APIRole } from 'discord-api-types';
import { CategoryChannel, Guild, GuildChannel, Role, User, VoiceChannel } from 'discord.js';
import ExtendedClient from 'src/Client';
import { CommandError, DataBaseError } from '../../Error';

export async function addOwner(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    const settings = server.settings;
    if(author.id != guild.ownerId) throw new CommandError("Permission denied.");
    if(!user) throw new CommandError("Cannot find a user.");
    if(settings.owners.includes(user.id)) throw new CommandError("This user already has owner permissions")
    settings.owners.push(user.id);
    await client.database.updateSettings(server.guild, {
        owners: settings.owners
    });
    return client.embeds.ownerAdded(user.username);
}

export async function removeOwner(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    const settings = server.settings;
    if(author.id != guild.ownerId) throw new CommandError("Permission denied.");
    if(!user) throw new CommandError("Cannot find a user.");
    if(!settings.owners.includes(user.id)) throw new CommandError("This user does not have owner permissions")
    settings.owners.filter(id => id != user.id);
    await client.database.updateSettings(server.guild, {
        owners: settings.owners
    });
    return client.embeds.ownerRemoved(user.username);
}

export async function setLimit(client: ExtendedClient, guild: Guild, author: User, limit: number) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    await client.database.updateSettings(guild.id, {limit: limit});
    return client.embeds.limitChanged(limit);
}

export async function setLog(client: ExtendedClient, guild: Guild, author: User, channel: GuildChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    if(channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') throw new CommandError("Only text or news channel allowed");
    await client.database.updateSettings(guild.id, {logging_channel: channel.id});
    return client.embeds.logRiggedUp(channel.name);
}

export async function setEventRole(client: ExtendedClient, guild: Guild, author: User, role: Role | APIRole) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    await client.database.updateSettings(guild.id, {event_role: role.id});
    return client.embeds.notificationRoleAccepted(role.name);
}

export async function setNotification(client: ExtendedClient, guild: Guild, author: User, channel: GuildChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    if(channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') throw new CommandError("Only text or news channel allowed");
    await client.database.updateSettings(guild.id, {notification_channel: channel.id});
    return client.embeds.notificationChannelRiggedUp(channel.name);
}

export async function addToBlackList(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    const list = server.settings.black_list;
    const player = await client.database.getPlayerRelation(user.id);
    player.banned = player.banned ? player.banned + 1 : 1;
    const member = player.membership.find(member => member.guildId == guild.id);
    if(!member) throw new DataBaseError("User is not a member of this guild.");
    member.banned = true;
    list.push(user.id);
    await client.database.updateMember(member);
    await client.database.updatePlayer(player);
    await client.database.updateSettings(guild.id, {black_list: list});
    return client.embeds.addedToBlackList(user.id);
}

export async function removeFromBlackList(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    const player = await client.database.getPlayerRelation(user.id);
    if(player.banned)
        player.banned--;
    else throw new CommandError("Player was not banned on this server.");
    const member = player.membership.find(member => member.guildId == guild.id);
    if(!member) throw new DataBaseError("User is not a member of this guild.");
    member.banned = false;
    const list = server.settings.black_list;
    list.splice(list.indexOf(user.id));
    await client.database.updateMember(member);
    await client.database.updatePlayer(player);
    await client.database.updateSettings(guild.id, {black_list: list});
    return client.embeds.removedFromBlackList(user.id);
}

export async function setOccasionLimit(client: ExtendedClient, guild: Guild, author: User, amount: number) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(amount < 1) throw new CommandError("You can only use positive non zero numbers.");
    if(author.id != guild.ownerId) throw new CommandError("Permission denied.");
    await client.database.updateSettings(guild.id, {occasion_limit: amount});
    return client.embeds.occasionLimitChanged(amount);
}

export async function setOccasions(client: ExtendedClient, guild: Guild, author: User, channel: VoiceChannel, category: CategoryChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    await client.database.updateServer(guild.id, {
        eventChannel: channel.id, 
        eventCategory: category.id
    });
    return client.embeds.occasionsRiggedUp(channel.name, category.name);
}