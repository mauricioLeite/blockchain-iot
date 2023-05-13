import { Block } from "./block"
import { Block as BlockEntity } from "../entities/block.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { InsertResult } from "typeorm";

describe("resource Block", () => {

    describe("#init", () => {
        const instance = new Block(new DatabaseConnector());

        const blockEntity = { 
            index : 0,
            transaction : '{data: "test"}',
            previous_hash : 'k20skc=d120k1+e',
            nonce : 5,
            hash : 'jo2mfdm0d,d-d=d3'
        };

        it("should init", async () => {
            const result = await instance.init();
            
            expect(typeof result === 'boolean').toBeTruthy();
            expect(result).toBe(true);
        })

        //  Create new resource on Database - use carefully    
        it("should create a block", async () => {
            const result = await instance.create(blockEntity as BlockEntity);
            expect(result).toBeInstanceOf(InsertResult);
        })

        it("should recover entry with ID 2", async () => {
            const result = await instance.findById(5);

            expect(result).toBeInstanceOf(BlockEntity);
            expect(result?.index).toEqual(blockEntity.index);
            expect(result?.transaction).toEqual(blockEntity.transaction);
            expect(result?.previous_hash).toEqual(blockEntity.previous_hash);
            expect(result?.nonce).toEqual(blockEntity.nonce);
            expect(result?.hash).toEqual(blockEntity.hash);

            
        });
    })
})
