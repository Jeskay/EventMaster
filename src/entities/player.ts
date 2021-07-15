import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Commend } from "./commend";

@Entity()
export class Player{
    @PrimaryColumn()
    id!: string;

    @Column()
    eventsPlayed: number = 0;

    @Column()
    eventsHosted: number = 0;

    @Column()
    tournamentsPlayed: number = 0;

    @Column()
    tournamentsHosted: number = 0;

    @OneToMany(() => Commend, commend => commend.author)
    commendsBy: Promise<Commend[]>;

    @OneToMany(() => Commend, commend => commend.subject)
    commendsAbout: Promise<Commend[]>;

    @Column({type: 'timestamptz'})
    scoreTime: Date = new Date;

    @CreateDateColumn()
    joinedAt: Date;

}