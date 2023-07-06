import { MigrationInterface, QueryRunner } from "typeorm";

export class initialDatabase1688600992955 implements MigrationInterface {
    name = 'initialDatabase1688600992955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pending_transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "transaction_data" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "peers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "ip_address" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "devices" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "index" integer NOT NULL, "transaction" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "previous_hash" varchar NOT NULL, "nonce" integer NOT NULL, "hash" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "peers"`);
        await queryRunner.query(`DROP TABLE "pending_transactions"`);
    }

}
