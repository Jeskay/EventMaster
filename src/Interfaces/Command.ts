import Client from '../Client';
import { ApplicationCommandOption, CommandInteraction, CommandInteractionOption, Message} from 'discord.js';

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
    options: ApplicationCommandOption[];
    run: RunInteraction;
}
export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
}