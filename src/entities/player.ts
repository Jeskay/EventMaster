import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Commend } from "./commend";
import { Tag } from "./tag";

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

    @ManyToMany(() => Tag, tag => tag.subscribers)
    subscriptions: Promise<Tag[]>;

    @OneToMany(() => Commend, commend => commend.author)
    commendsBy: Promise<Commend[]>;

    @OneToMany(() => Commend, commend => commend.subject)
    commendsAbout: Promise<Commend[]>;

    @Column({nullable: true})
    minutesPlayed: number = 0;

    @Column({type: 'timestamptz'})
    scoreTime: Date = new Date;

    @CreateDateColumn()
    joinedAt: Date;

}