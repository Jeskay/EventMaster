import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, Interaction } from 'discord.js';
import {Button, ContextCommand, Event, InteractCommand} from '../Interfaces';

export const event: Event = {
    name: 'interactionCreate',
    run: (client, interaction: Interaction) => {
        if(interaction.isButton()) {
            const button = interaction as ButtonInteraction;
            if(button.componentType != 'BUTTON') return;
            const divider = button.customId.indexOf('.');
            const name = button.customId.substr(0, divider);
            const args = button.customId.substring(divider + 1).split(/ +/g);
            const btn = client.buttons.get(name);
            if(btn) (btn as Button).run(client, button, args);
        } else if(interaction.isCommand()) {
            const command = interaction as CommandInteraction;
            const cmd = client.slashCommands.get(command.commandName);
            if(cmd) (cmd as InteractCommand).run(client, command);
        } else if(interaction.isContextMenu()) {
            const command = interaction as ContextMenuInteraction;
            const cmd = client.contextMenu.get(command.commandName);
            if(cmd) (cmd as ContextCommand).run(client, command);
        }
    }
}