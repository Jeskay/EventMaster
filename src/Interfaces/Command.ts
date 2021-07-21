import Client from '../Client';
import { Message} from 'discord.js';
import { Option } from './Option';

interface Run {
    (client: Client, message: Message, args: string[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    options?: Option[];
    run: Run;
}