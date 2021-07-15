import {Client, Collection} from 'discord.js';
import path from 'path';
import {readdirSync} from 'fs';
import {createConnection} from "typeorm";
import {Command, Event, Button} from '../Interfaces';
import {Config} from '../Config';
import { DataBaseManager, VoteManager, HelperManager, RoomManger, EmbedManager } from '../Managers';
import { ChannelController, RatingController } from '../Controllers';

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public config: Config = new Config();
    public database: DataBaseManager;
    public helper: HelperManager = new HelperManager();
    public room: RoomManger = new RoomManger();
    public vote: VoteManager = new VoteManager(); 
    public embeds: EmbedManager = new EmbedManager();
    public channelController: ChannelController = new ChannelController();
    public ratingController: RatingController = new RatingController();

    public async init() {
        this.login(this.config.token);
        /* database */
        await createConnection();
        this.database = new DataBaseManager();
        /* commands */
        const commandPath = path.join(__dirname, "..", "Commands");
        const file_ending = (this.config.state == "dev") ? '.ts' : '.js';
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(file_ending));
            for(const file of commands) {
                const {command} = require(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.name, command);

                if(command?.aliases.length !== 0) {
                    command.aliases.forEach((alias: string) => {
                        this.aliases.set(alias, command);
                    });
                }
            }
        });
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