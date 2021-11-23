import { MessageActionRow, MessageButton } from "discord.js";

    export const LikeButton = (id: string) => new MessageButton()
    .setStyle(3)
    .setCustomId(id)
    .setEmoji('👍');

    export const DislikeButton = (id: string) => new MessageButton()
    .setStyle(4)
    .setCustomId(id)
    .setLabel('👎');

    export const NextButton = (id: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('▶️');

    export const PreviusButton = (id: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id)
    .setLabel('◀️');

    export const GuildProfileButton = (disabled: boolean, id?: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id ?? "none")
    .setDisabled(!id || disabled)
    .setLabel('Guild Profile');

    export const GlobalProfileButton = (disabled: boolean, id?: string) => new MessageButton()
    .setStyle(1)
    .setCustomId(id ?? "none")
    .setDisabled(!id || disabled)
    .setLabel('Global Profile');

    
    export const Profiles = (guildShown: boolean, playerId: string, guildId?: string) => new MessageActionRow()
    .addComponents(GuildProfileButton(guildShown, guildId ? `guildprofile.${playerId}` : undefined), GlobalProfileButton(!guildShown, `globalprofile.${playerId}`), LikeButton(`likePlayer.${playerId}`), DislikeButton(`dislikePlayer.${playerId}`));

    export const ListMessage = (prevId: string, nextId: string) => new MessageActionRow()
    .addComponents(PreviusButton(prevId), NextButton(nextId));
    
    export const HostCommend = (likeId: string, dislikeId: string) => new MessageActionRow()
    .addComponents(LikeButton(likeId), DislikeButton(dislikeId));

