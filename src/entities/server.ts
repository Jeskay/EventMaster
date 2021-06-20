import {Entity, Column, CreateDateColumn, OneToMany, PrimaryColumn} from "typeorm"
import { Occasion } from "./occasion";
import { Settings } from "./settings";

@Entity()
export class Server {
    @PrimaryColumn()
    guild!: string;

    @OneToMany(() => Occasion, occasion => occasion.server)
    events: Occasion[];
    
    @Column(() => Settings)
    settings!: Settings;

    @Column({nullable: true})
    eventChannel: string;

    @Column({nullable: true})
    eventCategory: string;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    description: string;
}
