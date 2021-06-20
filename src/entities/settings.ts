import {Column} from "typeorm";

export class Settings {

    @Column("bigint", {nullable: false, array: true})
    owners: string[];
    
    @Column()
    limit: number;

    @Column({type: "text", array: true})
    black_list: string[];

    constructor(owner: string, limit: number, black_list: string[]){
        this.limit = limit;
        this.black_list = black_list;
        this.owners = [owner];
    }
}