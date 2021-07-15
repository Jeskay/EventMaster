import { MessageComponent } from 'discord-buttons';
import { Button, Event } from '../Interfaces';
/*Id format: 
    name.args
    args divided by tabs
*/
export const event: Event = {
    name: 'clickButton',
    run: async (client, button: MessageComponent) => {
        const divider = button.id.indexOf('.');
        const name = button.id.substr(0, divider);
        const args = button.id.substring(divider + 1).split(/ +/g);
        const btn = client.buttons.get(name);
        if(btn) (btn as Button).run(client, button, args);
    }
}