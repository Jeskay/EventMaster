import { ButtonInteraction, CommandInteraction, ContextMenuInteraction } from "discord.js";
import { errorInformation } from "../Embeds";
import ExtendedClient from "../Client";
import { CustomErrors } from ".";

export function handleDeferedCommandError(client: ExtendedClient, interaction: CommandInteraction | ButtonInteraction | ContextMenuInteraction, error: Error){
    if(client.config.state == 'dev') 
        interaction.editReply({embeds: [errorInformation(error.name, error.message, error.stack)]});
    else if(CustomErrors[error.name]) 
        interaction.editReply({embeds: [errorInformation(error.name, error.message)]});
    else {
        console.log(error);
        interaction.editReply({embeds: [errorInformation("Unexpected error", "Contact us through the google form and describe what action caused the error.")]});
    }
}
export function handleCommandError(client: ExtendedClient, interaction: CommandInteraction | ButtonInteraction | ContextMenuInteraction,  error: Error){
    console.log(error.name);
    if(client.config.state == 'dev') {
        interaction.reply({embeds: [errorInformation(error.name, error.message, error.stack)], ephemeral: true});
    } else {
        if(CustomErrors[error.name])
            interaction.reply({embeds: [errorInformation(error.name, error.message)], ephemeral: true});
        else{
            console.log(error);    
            interaction.reply({embeds: [errorInformation("Unexpected error", "Contact us through the google form and describe what action caused the error.")], ephemeral: true});
        }
    }
}