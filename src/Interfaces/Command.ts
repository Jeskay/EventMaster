import Client from '../Client';
import { ApplicationCommandChannelOption, ApplicationCommandChoicesOption, ApplicationCommandNonOptions, CommandInteraction, CommandInteractionOption, Message, } from 'discord.js';

interface RunRaw {
    (client: Client, message: Message, args: string[]): any;
}
interface RunInteraction {
    (client: Client, command: CommandInteraction): any;
}
export interface TextCommand extends Command {
    options: CommandInteractionOption[];
    run: RunRaw;
}
export interface InteractCommand extends Command {
    options: InteractCommandOption[];
    run: RunInteraction;
}
export type InteractCommandOption = ApplicationCommandNonOptions | ApplicationCommandChannelOption | ApplicationCommandChoicesOption;
export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
}