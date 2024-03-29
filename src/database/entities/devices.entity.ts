import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Devices {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    index: number;

    @Column()
    uuid: number;

    @Column({ type: "text" })
    transaction: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    previous_hash: string;

    @Column()
    nonce: number;

    @Column()
    hash: string;
}