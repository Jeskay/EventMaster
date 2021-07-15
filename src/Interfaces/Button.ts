import { MessageComponent } from 'discord-buttons';
import Client from '../Client';

interface Run {
    (client: Client, component: MessageComponent, args: string[]): any;
}

export interface Button {
    name: string;
    description?: string;
    run: Run;
}