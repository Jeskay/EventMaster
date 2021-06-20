import {Event} from '../Interfaces';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        if(client.user == null)
            console.log("User is null, please check bot token.")
        else console.log(`${client.user.tag} is online`);
    }
}