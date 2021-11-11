import { VoiceChannel, VoiceState } from 'discord.js';
import { MemberState } from '../Managers/room';
import { Event } from '../Interfaces';
import { joinHandler, leftHandler } from '../Controllers';

export const event: Event = {
    name: 'voiceStateUpdate',
    run: async (client, oldState: VoiceState, newState: VoiceState) => {
        if(newState.member == null || newState.member.user.bot) return;
        try {   
            const state = client.room.checkState(oldState, newState);
            switch(state){
                case MemberState.other:
                    break;
                case MemberState.joined:
                    await joinHandler(client, newState.member, newState.channel as VoiceChannel);
                    break;
                case MemberState.left:
                    await leftHandler(client, oldState.channel as VoiceChannel);
                    break;
                case MemberState.moved:
                    await joinHandler(client, newState.member, newState.channel as VoiceChannel);
                    await leftHandler(client, oldState.channel as VoiceChannel);
                    break;
            }
        } catch(error) {
            console.log(error);
        }
    }
}