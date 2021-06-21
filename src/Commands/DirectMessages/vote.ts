import {Command} from '../../Interfaces';

export const command: Command = {
    name: 'vote',
    aliases: ['v'],
    run: async(client, message, args) => {
        const author = message.author;
        if(args.length != 1) return;
        const candidateID = args[0];
        if(author.id == candidateID) return;

    }
}; 