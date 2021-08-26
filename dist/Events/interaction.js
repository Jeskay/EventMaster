"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: 'interactionCreate',
    run: (client, interaction) => {
        if (interaction.isButton()) {
            const button = interaction;
            if (button.componentType != 'BUTTON')
                return;
            const divider = button.customId.indexOf('.');
            const name = button.customId.substr(0, divider);
            const args = button.customId.substring(divider + 1).split(/ +/g);
            const btn = client.buttons.get(name);
            if (btn)
                btn.run(client, button, args);
        }
        else if (interaction.isCommand()) {
            const command = interaction;
            const cmd = client.slashCommands.get(command.commandName);
            if (cmd)
                cmd.run(client, command);
        }
    }
};
