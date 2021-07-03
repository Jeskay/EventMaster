
import { Connection, getConnection } from "typeorm";
import { Server } from "../entities/server";
import { Occasion } from "../entities/occasion";

export class DataBaseManager{
    private connection: Connection;

    public connect = async () => await this.connection.connect();
    /** @returns server by guild id */
    public getServer = async(serverID: string) => await this.connection.manager.findOne(Server, {guild: serverID});
    /**
     * 
     * @param serverID 
     * @returns server instance with occasions
     */
    public async getServerRelations(serverID: string) {
            const server = await this.connection.getRepository(Server)
            .createQueryBuilder("server")
            .leftJoinAndSelect("server.events", "occasion")
            .where("server.guild = :guild", {guild: serverID})
            .getOne()
            .catch(err => { throw err });
            if(!server) throw Error("Guild with followed id is not registered.");
            return server;
    }
    /** Creates Occasion instance */
    public occasion = (event: object) => this.connection.manager.create(Occasion, event);
    /**
     * Updates server instance
     * @param guildID guild id
     * @param params object with fields and values which need to be updated
     * @returns Promise
     */
    public async updateServer(guildID: string, params: object){
        const current = await this.getServer(guildID);
        if(!current) throw Error("Cannot find server.");
        else Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
        await this.connection.manager.save(current);
    }
    /**
     * Updates server settings
     * @param guildID guild id
     * @param params object with settings which need to be updated
     */
    public async updateSettings(guildID: string, params: object){
        const server = await this.getServer(guildID);
        if(!server) throw Error("Cannot find server.");
        Object.keys(server.settings).forEach(key => server.settings[key] = key in params ? params[key] : server.settings[key]);
        await this.connection.manager.save(server);
    }
    /**
     * Adds occasion instance to the server
     * @param guildID guild id
     * @param occasion object with fields and values which need to be added
     * @returns Promise
     */
    public async addOccasion(guildID: string, occasion: object){
        const post = this.occasion(occasion);
        const server = await this.getServer(guildID);
        if(!server) throw Error("Guild with followed id is not registered.");
        else if(server.events && server.events.includes(post)) throw Error("There is occasion's duplicate.");
        await this.connection.manager.save(post);
    }
    /**
     * Removes occasion
     * @param guildID guild id
     * @param voiceChannel voice channel id
     * @returns Promise
     */
    public async removeOccasion(guildID: string, voiceChannel: string){
        const server = await this.getServerRelations(guildID);
        if(!server) throw Error("Guild with followed id is not registered.");
        const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
        if(!occasion) throw Error("Cannot find occasion with following voice channel");
        await this.connection.manager.remove(occasion);
        return {voice: occasion.voiceChannel, text: occasion.textChannel};
    }
    /**
     * Adds server to the database
     * @param server object with fields and values of Server
     * @returns Promise
     */
    public async addServer(server: object){
        const post = this.connection.manager.create(Server, server);
        const duplicate = await this.getServer(post.guild);
        if(duplicate) throw Error("Server with such id already exists.");
        await this.connection.manager.save(post);
    }
    /**
     * Removes server instance
     * @param serverID guild id
     * @returns Promise
     */
    public async removeServer(serverID: string){
        const server = await this.getServer(serverID);
        if(server == undefined) throw Error("")
        this.connection.manager.remove(server);
    }

    constructor (){
        this.connection = getConnection();
    }
}