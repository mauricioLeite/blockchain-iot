import { Peers } from "./peers"
import { DatabaseConnector, PeersEntity } from "@database"
import { InsertResult } from "typeorm";

describe("resource Peers", () => {

    describe("#init", () => {
        const instance = new Peers(new DatabaseConnector());

        const peersData = { 
            ip_address : '127.0.0.1'
        };

        it("should init", async () => {
            const result = await instance.init();
            
            expect(typeof result === 'boolean').toBeTruthy();
            expect(result).toBe(true);
        })

        //  Create new resource on Database - use carefully    
        it("should create a peers entry", async () => {
            const result = await instance.create(peersData as PeersEntity);
            expect(result).toBeInstanceOf(InsertResult);
        })

        it("should recover entry with ip_address defined", async () => {
            const result = await instance.findByIp('127.0.0.1');
            
            expect(result).toBeInstanceOf(PeersEntity);
            expect(result?.ip_address).toEqual(peersData.ip_address);

        });
    })
})
