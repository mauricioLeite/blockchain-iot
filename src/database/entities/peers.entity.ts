import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Peers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ip_address: string;
}