import { ContextMenuInteraction } from "discord.js";
import Client from "../Client";
import { Command } from ".";

interface RunContextCommand {
    (client: Client, contextmenu: ContextMenuInteraction): any;
}
export enum ContextType{
    USER = 2,
    MESSAGE =3
}
export interface ContextCommand extends Command {
    type: ContextType;
    run: RunContextCommand;
}