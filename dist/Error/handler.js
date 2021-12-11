"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommandError = exports.handleDeferedCommandError = void 0;
const Embeds_1 = require("../Embeds");
const _1 = require(".");
function handleDeferedCommandError(client, interaction, error) {
    if (client.config.state == 'dev')
        interaction.editReply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message, error.stack)] });
    else if (_1.CustomErrors[error.name])
        interaction.editReply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message)] });
    else {
        console.log(error);
        interaction.editReply({ embeds: [(0, Embeds_1.errorInformation)("Unexpected error", "Contact us through the google form and describe what action caused the error.")] });
    }
}
exports.handleDeferedCommandError = handleDeferedCommandError;
function handleCommandError(client, interaction, error) {
    console.log(error.name);
    if (client.config.state == 'dev') {
        interaction.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message, error.stack)], ephemeral: true });
    }
    else {
        if (_1.CustomErrors[error.name])
            interaction.reply({ embeds: [(0, Embeds_1.errorInformation)(error.name, error.message)], ephemeral: true });
        else {
            console.log(error);
            interaction.reply({ embeds: [(0, Embeds_1.errorInformation)("Unexpected error", "Contact us through the google form and describe what action caused the error.")], ephemeral: true });
        }
    }
}
exports.handleCommandError = handleCommandError;
