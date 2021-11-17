import {TextCommand} from '../../Interfaces';
import {blackList} from '../../Commands/Guild'

export const command: TextCommand = {
    name: 'blacklist',
    description: 'shows all users blocked from events on this server.',
    aliases: ['black_list'],
    options: [],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length > 0) return;
            await blackList(client, message.channel,message.author, guild);
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};