import {Client, Collection, Guild} from "discord.js";
import {REST} from '@discordjs/rest';
import path from 'path';
import {readdirSync, readdir} from 'fs';
import {promisify} from'util';
import {createConnection} from "typeorm";
import {Event, Button, TextCommand, InteractCommand, ContextCommand} from '../Interfaces';
import {Config} from '../Config';
import { DataBaseManager, VoteManager } from '../Managers';
import { List } from '../Utils';
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import { createOption } from "../Utils";
import { InteractCommandOption } from "../Interfaces/Command";
import { Settings } from "src/entities/settings";

class ExtendedClient extends Client {
    public config: Config = new Config();
    public commands: Collection<string, TextCommand> = new Collection();
    public slashCommands: Collection<string, Collection<string, InteractCommand>> = new Collection();
    public contextMenu: Collection<string, ContextCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, TextCommand> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public database: DataBaseManager;
    public vote: VoteManager = new VoteManager(); 
    public lists: Collection<string, List> = new Collection();

    private async extractCommands(path: string) {
        const commands: Array<any> = [];
        const subCommands: Collection<string, any> = new Collection();
        const readdirAsync = promisify(readdir);
        const dirs = await readdirAsync(path);

        await Promise.all(dirs.map(async dir => {
            let slash_command = new SlashCommandBuilder()
            .setName(dir)
            .setDescription(`Commands ${dir} can use.`);
            const files = await readdirAsync(`${path}/${dir}`);
            await Promise.all(files.map( async (file) => {
                const { command } = await import(`${path}/${dir}/${file}`);
                slash_command.addSubcommand(subCommand => {
                    subCommand
                    .setName(command.name)
                    .setDescription(command.description);
                    (command.options as InteractCommandOption[]).forEach(option => {
                        subCommand = createOption(option, subCommand);
                    });
                    if(!subCommands.get(command.name))subCommands.set(subCommand.name, command);
                    return subCommand;
                });
            }));
            if(!this.slashCommands.get(slash_command.name)) this.slashCommands.set(slash_command.name, subCommands);
            commands.push(slash_command.toJSON());
        }));
        return commands;
    }

    private async extractContextCommands() {
        if(!this.user) throw Error("User unavailable");
        const readdirAsync = promisify(readdir);
        const interactionPath = path.join(__dirname, "..", "ContextMenu");
        const files = await readdirAsync(`${interactionPath}`);
        const commands: Array<any> = [];
        await Promise.all(files.map(async (file) => {
            const { command } = await import(`${interactionPath}/${file}`);
            const contextCommand = {
                name: command.name,
                type: command.type
            };
            if(!this.contextMenu.get(command.name)) this.contextMenu.set(command.name, command);
            commands.push(contextCommand);
        }));
        return commands;
    }

    public async registerGuildCommands(client: ExtendedClient, guilds: Collection<string, Guild>, clientId: string) {
        const rest = new REST({version: '9'}).setToken(this.config.token);
        const interactionPath = path.join(__dirname, "..", "SlashCommands/Guild");
        const commands = await this.extractCommands(interactionPath);
        const contextCommands = await this.extractContextCommands();
        await Promise.all(guilds.map(async (guild) => { 
            await rest.put(Routes.applicationGuildCommands(clientId, guild.id), {
                body: commands.concat(contextCommands)
            }).catch(err => {
                console.log(`Unable to register because of ${err}`);
            });
            const server = await client.database.getServer(guild.id);
            if(!server) {
                console.log(`Guild ${guild} not found in database.`);
                client.database.addServer({
                    settings: new Settings(guild.ownerId, 2, []),
                    events: [],
                    guild: guild.id,
                    description: "empty"
                });
            }
            console.log(`Registered at ${guild}`);
        }));
        console.log(`Amount of guilds: ${guilds.size}`);
    }

    public async registerGlobalCommands() {
        const rest = new REST({version: '9'}).setToken(this.config.token);
        const interactionPath = path.join(__dirname, "..", "SlashCommands/Global");
        const commands = await this.extractCommands(interactionPath);
        if(!this.user) throw Error("Unable to access bot.");
        await rest.put(Routes.applicationCommands(this.user.id), {
            body: commands
        });
    }
    public async init() {
        /* database */
        await createConnection();
        this.database = new DataBaseManager();
        /* commands */
        const file_ending = (this.config.state == "dev") ? '.ts' : '.js';
        /* buttons */
        const buttonPath = path.join(__dirname, "..", "Buttons");
        readdirSync(buttonPath).forEach(dir => {
            const buttons = readdirSync(`${buttonPath}/${dir}`).filter(file => file.endsWith(file_ending));
            for(const file of buttons) {
                const {button} = require(`${buttonPath}/${dir}/${file}`);
                this.buttons.set(button.name, button);
            }
        });
        /* events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).forEach(async (file) => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            console.log(event);
            this.on(event.name, event.run.bind(null, this));
        });
        await this.login(this.config.token);
    }
}

export default ExtendedClient;