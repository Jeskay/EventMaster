import { CommandError } from '../../Error';
import {TextCommand} from '../../Interfaces';
import {setOccasions} from '../../Commands/Setup/';
import { getRelatedChannels } from '../../Utils';

export const command: TextCommand = {
    name: 'setup',
    description: 'set channel where to join for event and category where rooms will be created',
    aliases: ['s'],
    options: [{name: 'channel', type: "CHANNEL"}, {name: 'category', type: "CHANNEL"}],
    run: async(client, message, args) => {
        try {
            const guild = message.guild;
            if(!guild) return;
            if(args.length != 2) throw new CommandError("Invalid number of arguments.");
            const {voice, category} = await getRelatedChannels(args[0], args[1], guild);
            const response = await setOccasions(client, guild, message.author, voice, category);
            await message.channel.send({embeds: [response]});
        } catch(error) {
            if(error instanceof Error)
                message.channel.send({embeds: [client.embeds.errorInformation(error.name, error.message)]});
        }
    }
};