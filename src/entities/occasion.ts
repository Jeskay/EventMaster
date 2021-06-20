import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import {Server} from "./server";
import {OccasionState} from "../Managers/room";

@Entity()
export class Occasion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Server, server => server.events, {cascade: true})
    server: Server;

    @Column('int')
    state: OccasionState; 

    @Column()
    voiceChannel: string;

    @Column()
    textChannel: string;

    @Column()
    host!: string;

    @Column({type: 'date', nullable: true})
    startedAt: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    description: string;
}