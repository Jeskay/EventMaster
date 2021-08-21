import { MessageComponentInteraction } from 'discord.js';
import { Button, Event } from '../Interfaces';
/*Id format: 
    name.args
    args divided by tabs
*/
export const event: Event = {
    name: "interactionCreate",
    run: async (client, button: MessageComponentInteraction) => {
        if(button.componentType != 'BUTTON') return;
        const divider = button.customId.indexOf('.');
        const name = button.customId.substr(0, divider);
        const args = button.customId.substring(divider + 1).split(/ +/g);
        const btn = client.buttons.get(name);
        if(btn) (btn as Button).run(client, button, args);
    }
}