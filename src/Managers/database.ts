
import { Connection, getConnection } from "typeorm";
import { Server } from "../entities/server";
import { Occasion } from "../entities/occasion";
/* Wrap in promises */
export class DataBaseManager{
    private orm: Connection;

    public connect = async () => await this.orm.connect();

    public getServer = async(serverID: string) => await this.orm.manager.findOne(Server, {guild: serverID});

    public async getServerRelations(serverID: string) {
        return await this.orm.getRepository(Server)
        .createQueryBuilder("server")
        .leftJoinAndSelect("server.events", "occasion")
        .where("server.guild = :guild", {guild: serverID})
        .getOne()
    }

    public occasion = (event: object) => this.orm.manager.create(Occasion, event);

    public async updateServer(guildID: string, params: object){
        const current = await this.getServer(guildID);
        if(current == undefined) return false;
        Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
        await this.orm.manager.save(current);
        return true;
    }
    public async addOccasion(guildID: string, occasion: object){
        const post = this.occasion(occasion);
        const server = await this.getServer(guildID);
        if(server == undefined) return false;
        if(server.events != undefined && server.events.includes(post)) return false;
        await this.orm.manager.save(post);
        return true;
    }
    public async removeOccasion(guildID: string, voiceChannel: string){
        const server = await this.getServerRelations(guildID);
        if(server == undefined) throw Error;
        const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
        if(occasion == undefined) throw Error;
        await this.orm.manager.remove(occasion);
        return {voice: occasion.voiceChannel, text: occasion.textChannel};
    }

    public async addServer(server: object){
        const post = this.orm.manager.create(Server, server);
        const duplicate = await this.getServer(post.guild);
        if(duplicate != undefined) return false;
        await this.orm.manager.save(post);
        return true;
    }

    public async removeServer(serverID: string){
        const server = await this.getServer(serverID);
        if(server == undefined) return false;
        this.orm.manager.remove(server);
        return true;
    }

    constructor (){
        this.orm = getConnection();
    }
}