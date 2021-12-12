import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./player";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Player)
    @JoinColumn()
    author: Player;

    @Column("varchar", {length: 300})
    text: string;

    @Column()
    score: number;

    @CreateDateColumn()
    createdAt: Date;
}