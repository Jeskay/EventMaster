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
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
const Config_1 = require("../Config");
const database_1 = require("../Managers/database");
const helper_1 = require("../Managers/helper");
const room_1 = require("../Managers/room");
const vote_1 = require("../Managers/vote");
const channel_1 = require("../Controllers/channel");
class ExtendedClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.config = new Config_1.Config();
        this.helper = new helper_1.HelperManager();
        this.room = new room_1.RoomManger();
        this.vote = new vote_1.VoteManager();
        this.channelController = new channel_1.ChannelController();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.login(this.config.token);
            yield typeorm_1.createConnection();
            this.database = new database_1.DataBaseManager();
            const commandPath = path_1.default.join(__dirname, "..", "Commands");
            fs_1.readdirSync(commandPath).forEach((dir) => {
                const file_ending = (this.config.state == "dev") ? '.ts' : '.js';
                console.log(file_ending);
                const commands = fs_1.readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(file_ending));
                for (const file of commands) {
                    const { command } = require(`${commandPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    if ((command === null || command === void 0 ? void 0 : command.aliases.length) !== 0) {
                        command.aliases.forEach((alias) => {
                            this.aliases.set(alias, command);
                        });
                    }
                }
            });
            const eventPath = path_1.default.join(__dirname, "..", "Events");
            fs_1.readdirSync(eventPath).forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const { event } = yield Promise.resolve().then(() => __importStar(require(`${eventPath}/${file}`)));
                this.events.set(event.name, event);
                console.log(event);
                this.on(event.name, event.run.bind(null, this));
            }));
        });
    }
}
exports.default = ExtendedClient;
