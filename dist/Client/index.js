"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const util_1 = require("util");
const typeorm_1 = require("typeorm");
const Config_1 = require("../Config");
const Managers_1 = require("../Managers");
const Utils_1 = require("../Utils");
const v9_1 = require("discord-api-types/v9");
const builders_1 = require("@discordjs/builders");
const Utils_2 = require("../Utils");
class ExtendedClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.config = new Config_1.Config();
        this.commands = new discord_js_1.Collection();
        this.slashCommands = new discord_js_1.Collection();
        this.contextMenu = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.buttons = new discord_js_1.Collection();
        this.vote = new Managers_1.VoteManager();
        this.lists = new discord_js_1.Collection();
    }
    extractCommands(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const commands = [];
            const subCommands = new discord_js_1.Collection();
            const readdirAsync = (0, util_1.promisify)(fs_1.readdir);
            const dirs = yield readdirAsync(path);
            yield Promise.all(dirs.map((dir) => __awaiter(this, void 0, void 0, function* () {
                let slash_command = new builders_1.SlashCommandBuilder()
                    .setName(dir)
                    .setDescription(`Commands ${dir} can use.`);
                const files = yield readdirAsync(`${path}/${dir}`);
                yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const { command } = yield Promise.resolve().then(() => __importStar(require(`${path}/${dir}/${file}`)));
                    slash_command.addSubcommand(subCommand => {
                        subCommand
                            .setName(command.name)
                            .setDescription(command.description);
                        command.options.forEach(option => {
                            subCommand = (0, Utils_2.createOption)(option, subCommand);
                        });
                        if (!subCommands.get(command.name))
                            subCommands.set(subCommand.name, command);
                        return subCommand;
                    });
                })));
                if (!this.slashCommands.get(slash_command.name))
                    this.slashCommands.set(slash_command.name, subCommands);
                commands.push(slash_command.toJSON());
            })));
            return commands;
        });
    }
    extractContextCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.user)
                throw Error("User unavailable");
            const readdirAsync = (0, util_1.promisify)(fs_1.readdir);
            const interactionPath = path_1.default.join(__dirname, "..", "ContextMenu");
            const files = yield readdirAsync(`${interactionPath}`);
            const commands = [];
            yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const { command } = yield Promise.resolve().then(() => __importStar(require(`${interactionPath}/${file}`)));
                const contextCommand = {
                    name: command.name,
                    type: command.type
                };
                if (!this.contextMenu.get(command.name))
                    this.contextMenu.set(command.name, command);
                commands.push(contextCommand);
            })));
            return commands;
        });
    }
    registerGuildCommands(guilds, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '9' }).setToken(this.config.token);
            const interactionPath = path_1.default.join(__dirname, "..", "SlashCommands/Guild");
            const commands = yield this.extractCommands(interactionPath);
            const contextCommands = yield this.extractContextCommands();
            yield Promise.all(guilds.map((guild) => __awaiter(this, void 0, void 0, function* () {
                yield rest.put(v9_1.Routes.applicationGuildCommands(clientId, guild), {
                    body: commands.concat(contextCommands)
                }).catch(err => {
                    console.log(`Unable to register because of ${err}`);
                });
            })));
        });
    }
    registerGlobalCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '9' }).setToken(this.config.token);
            const interactionPath = path_1.default.join(__dirname, "..", "SlashCommands/Global");
            const commands = yield this.extractCommands(interactionPath);
            if (!this.user)
                throw Error("Unable to access bot.");
            yield rest.put(v9_1.Routes.applicationCommands(this.user.id), {
                body: commands
            });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.createConnection)();
            this.database = new Managers_1.DataBaseManager();
            const commandPath = path_1.default.join(__dirname, "..", "TextCommands");
            const file_ending = (this.config.state == "dev") ? '.ts' : '.js';
            (0, fs_1.readdirSync)(commandPath).forEach((dir) => {
                const commands = (0, fs_1.readdirSync)(`${commandPath}/${dir}`).filter((file) => file.endsWith(file_ending));
                for (const file of commands) {
                    const { command } = require(`${commandPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    if (command.aliases && command.aliases.length !== 0) {
                        command.aliases.forEach((alias) => {
                            this.aliases.set(alias, command);
                        });
                    }
                }
            });
            this.lists.set('help', new Utils_1.List(60, (0, Utils_2.commandsList)(this), 10));
            const buttonPath = path_1.default.join(__dirname, "..", "Buttons");
            (0, fs_1.readdirSync)(buttonPath).forEach(dir => {
                const buttons = (0, fs_1.readdirSync)(`${buttonPath}/${dir}`).filter(file => file.endsWith(file_ending));
                for (const file of buttons) {
                    const { button } = require(`${buttonPath}/${dir}/${file}`);
                    this.buttons.set(button.name, button);
                }
            });
            const eventPath = path_1.default.join(__dirname, "..", "Events");
            (0, fs_1.readdirSync)(eventPath).forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const { event } = yield Promise.resolve().then(() => __importStar(require(`${eventPath}/${file}`)));
                this.events.set(event.name, event);
                console.log(event);
                this.on(event.name, event.run.bind(null, this));
            }));
            yield this.login(this.config.token);
        });
    }
}
exports.default = ExtendedClient;
