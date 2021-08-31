import { APIRole } from 'discord-api-types';
import { CategoryChannel, Guild, GuildChannel, Role, User, VoiceChannel } from 'discord.js';
import ExtendedClient from 'src/Client';
import { CommandError } from '../../Error';

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
}

export async function setLog(client: ExtendedClient, guild: Guild, author: User, channel: GuildChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    if(channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') throw new CommandError("Only text or news channel allowed");
    await client.database.updateSettings(guild.id, {logging_channel: channel.id});
    return `Channel ${channel.name} successfuly set for logging.`;
}

export async function setEventRole(client: ExtendedClient, guild: Guild, author: User, role: Role | APIRole) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    await client.database.updateSettings(guild.id, {event_role: role.id});
    return `Role ${role.name} will be mentioned in occasion notifications`;
}

export async function setNotification(client: ExtendedClient, guild: Guild, author: User, channel: GuildChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    if(channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') throw new CommandError("Only text or news channel allowed");
    await client.database.updateSettings(guild.id, {notification_channel: channel.id});
    return `Channel ${channel.name} successfuly set to notification.`;
}

export async function addToBlackList(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    const list = server.settings.black_list;
    list.push(user.id);
    await client.database.updateSettings(guild.id, {black_list: list});
    return client.embeds.addedToBlackList(user.id);
}

export async function removeFromBlackList(client: ExtendedClient, guild: Guild, author: User, user: User) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    const list = server.settings.black_list;
    list.splice(list.indexOf(user.id));
    await client.database.updateSettings(guild.id, {black_list: list});
    return client.embeds.removedFromBlackList(user.id);
}

export async function setOccasions(client: ExtendedClient, guild: Guild, author: User, channel: VoiceChannel, category: CategoryChannel) {
    const server = await client.database.getServer(guild.id);
    if(!server) throw new CommandError("Server is not registered yet.");
    if(!server.settings.owners.includes(author.id)) throw new CommandError("Permission denied.");
    await client.database.updateServer(guild.id, {
        eventChannel: channel.id, 
        eventCategory: category.id
    });
    return "channel and category successfuly binded.";
}