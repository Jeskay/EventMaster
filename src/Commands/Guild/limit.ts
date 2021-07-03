import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'setlimit',
    aliases: ['sl'],
    run: async(client, message, args) => {
        const guild = message.guild;
        if(guild == null) return;
        if(args.length != 1) return;
        try {
            const limit = parseInt(args[0]);
            await client.database.updateSettings(guild.id, {limit: limit});
        } catch(error) {
            await message.channel.send(client.embeds.errorInformation(error));
        }
    }
};