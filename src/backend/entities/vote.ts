import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {
    link: any;
    @PrimaryGeneratedColumn()
    public id: number;
    @ManyToOne(type => User, user => user.id)
    public user: User;
    @ManyToOne(type => Vote, vote => vote.id)
    public vote: Vote;
    @Column()
    public isUpvote: boolean;
}