import {ApplicationCommandOption, Client, Collection, Guild} from "discord.js";
import {REST} from '@discordjs/rest';
import path from 'path';
import {readdirSync, readdir} from 'fs';
import {promisify} from'util';
import {createConnection} from "typeorm";
import {Event, Button, TextCommand, InteractCommand, ContextCommand} from '../Interfaces';
import {Config} from '../Config';
import { DataBaseManager, VoteManager, HelperManager, RoomManger, EmbedManager } from '../Managers';
import { ChannelController, RatingController, OccasionController } from '../Controllers';
import { List } from '../List';
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";

class ExtendedClient extends Client {
    public config: Config = new Config();
    public commands: Collection<string, TextCommand> = new Collection();
    public slashCommands: Collection<string, InteractCommand> = new Collection();
    public contextMenu: Collection<string, ContextCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, TextCommand> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public database: DataBaseManager;
    public helper: HelperManager = new HelperManager();
    public room: RoomManger = new RoomManger();
    public vote: VoteManager = new VoteManager(); 
    public embeds: EmbedManager = new EmbedManager();
    public Lists: Collection<string, List> = new Collection();
    public channelController: ChannelController = new ChannelController();
    public ratingController: RatingController = new RatingController();
    public occasionController: OccasionController = new OccasionController();

    private async extractCommands(files: string[], path: string) {
        const commands: Array<any> = [];
        await Promise.all(files.map(async (file) => {
            const { command } = await import(`${path}/${file}`);
            let slash_command = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);
            (command.options as ApplicationCommandOption[]).forEach(option => {
                slash_command = this.helper.createOption(option, slash_command);
            });
            if(!this.slashCommands.get(command.name)) this.slashCommands.set(command.name, command);
            commands.push(slash_command.toJSON());
        }));
        return commands;
    }

    public async registerContextMenu() {
        if(!this.user) throw Error("User unavailable");
        const rest = new REST({version: '9'}).setToken(this.config.token);
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
        await rest.put(Routes.applicationCommands(this.user.id), {body: commands});
    }

    public async registerGuildCommands(guild: Guild, clientId: string) {
        const rest = new REST({version: '9'}).setToken(this.config.token);
        const readdirAsync = promisify(readdir);
        const interactionPath = path.join(__dirname, "..", "SlashCommands/Guild");
        const files = await readdirAsync(`${interactionPath}`);
        const commands = await this.extractCommands(files, interactionPath);
        await rest.put(Routes.applicationGuildCommands(clientId, guild.id), {
            body: commands
        });
    }

    public async registerGlobalCommands() {
        const rest = new REST({version: '9'}).setToken(this.config.token);
        const readdirAsync = promisify(readdir);
        const interactionPath = path.join(__dirname, "..", "SlashCommands/Global");
        const files = await readdirAsync(`${interactionPath}`);
        const commands = await this.extractCommands(files, interactionPath);
        if(!this.user) throw Error("Unable to access bot.");
        await rest.put(Routes.applicationCommands(this.user.id), {
            body: commands
        });
    }
    public async init() {
        this.login(this.config.token);
        /* database */
        await createConnection();
        this.database = new DataBaseManager();
        /* commands */
        const commandPath = path.join(__dirname, "..", "TextCommands");
        const file_ending = (this.config.state == "dev") ? '.ts' : '.js';
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(file_ending));
            for(const file of commands) {
                const {command} = require(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.name, command);

                if(command.aliases && command.aliases.length !== 0) {
                    command.aliases.forEach((alias: string) => {
                        this.aliases.set(alias, command);
                    });
                }
            }
        });
        this.Lists.set('help', new List(30, this.helper.commandsList(this), 10));
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
    }
}

export default ExtendedClient;