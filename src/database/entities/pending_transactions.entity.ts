import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class PendingTransactions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    transaction_data: string;

    @CreateDateColumn()
    created_at: Date;
}