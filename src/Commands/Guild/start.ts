import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'start',
    aliases: ['s'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(guild == null) return;
        try {
            const server = await client.database.getServerRelations(guild.id);
            const occasion = server.events.find(event => event.host == message.author.id);
            if(!occasion) throw Error("Only host has permission to start an event");
            if(args.length < 2) throw Error("Event name and description must be provided.");
            const title = args.shift();
            if(!title) throw Error("Event name must be provided");
            await client.database.updateOccasion(guild.id, occasion.voiceChannel, {
                Title: title, 
                startedAt: new Date,
                description: args.join(' ')
            });
            await message.channel.send(client.embeds.startedOccasion);
            // Log started event
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};