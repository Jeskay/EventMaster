import { CategoryChannel, VoiceState } from 'discord.js';
import { MemberState } from '../Managers/room';
import { Event } from '../Interfaces';
import { OccasionState } from '../Managers/room';

export const event: Event = {
    name: 'voiceStateUpdate',
    run: async (client, oldState: VoiceState, newState: VoiceState) => {
        if(newState.member == null || newState.member.user.bot) return;
        const state = client.room.checkState(oldState, newState);
        if(state == MemberState.other) return;
        if(state == MemberState.joined){
            console.log("new member joined");
            const server = await client.database.getServer(newState.guild.id);
            if(server == null || server.eventChannel != newState.channelID) return;
            const channel = newState.guild.channels.cache.get(server.eventCategory) as CategoryChannel;
            if(channel == undefined) return;
            const {voice, text} = await client.room.create(newState.member.user, channel);
            await newState.member.voice.setChannel(voice);
            /*Add text channel greeting*/
            const added = await client.database.addOccasion(newState.guild.id, {
                voiceChannel: voice.id,
                textChannel: text.id,
                host: newState.member.id,
                state: OccasionState.waiting,
                server: server
            });
            if(!added) text.send("Database Error");
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