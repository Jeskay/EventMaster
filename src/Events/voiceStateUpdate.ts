import { VoiceChannel, VoiceState } from 'discord.js';
import { MemberState } from '../Managers/room';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'voiceStateUpdate',
    run: async (client, oldState: VoiceState, newState: VoiceState) => {
        if(newState.member == null || newState.member.user.bot) return;
        const state = client.room.checkState(oldState, newState);
        if(state == MemberState.other) return;
        if(state == MemberState.joined){
            await client.channelController.joinHandler(client, newState.member, newState.channel as VoiceChannel);
        } else {
            console.log("member left");
            const server = await client.database.getServerRelations(oldState.guild.id);
            if(server == undefined) return;
            console.log(oldState.channelID);
            const occasion = server.events.find(event => event.voiceChannel == oldState.channelID);
            if(occasion == undefined) return;
            if(oldState.channel != null && oldState.channel.members.size == 0){
                await client.database.removeOccasion(oldState.guild.id, occasion.voiceChannel)
                await client.room.delete(oldState.guild, occasion.voiceChannel, occasion.textChannel);
            }
        }
    }
}