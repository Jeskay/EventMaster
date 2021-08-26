import { ButtonInteraction } from 'discord.js';
import Client from '../Client';

interface Run {
    (client: Client, component: ButtonInteraction, args: string[]): any;
}

export interface Button {
    name: string;
    description?: string;
    run: Run;
}