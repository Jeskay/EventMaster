import { MessageComponentInteraction } from 'discord.js';
import Client from '../Client';

interface Run {
    (client: Client, component: MessageComponentInteraction, args: string[]): any;
}

export interface Button {
    name: string;
    description?: string;
    run: Run;
}