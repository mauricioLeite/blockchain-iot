import { Nodes  } from "./nodes";
import { DatabaseResourceFactory } from "@database";

describe("Nodes Service", () => {

    describe("#init", () => {
        const instance: Nodes = new Nodes(new DatabaseResourceFactory());
        

        it("should clear registry blocks and peers", async () => {
            const result = await instance.clearLocal();
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(200);
            expect(result).toHaveProperty('message');
        })

        it("should add a new node to network", async () => {
            const payload = { nodeAddress: "123.456.789.101"};
            const result = await instance.newNode(payload);
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(201);
            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('networkNodes');
        })

        // !MINE TEST BEFORE TO GENERATE VALID BLOCK 
        // it("should sync external block", async () => {
        //     const block = { nodeAddress: "123.456.789.101"};
        //     const result = await instance.syncBlock(block);
        //     expect(result).toHaveProperty('status');
        //     expect(result.status).toBe(201);
        //     expect(result).toHaveProperty('message');
        //     expect(result).toHaveProperty('networkNodes');
        // })

        // !TEST JOIN NETWORK RUNNING ON LAN
        // it("should sync external block", async () => {
        //     const block = { nodeAddress: "123.456.789.101"};
        //     const result = await instance.syncBlock(block);
        //     expect(result).toHaveProperty('status');
        //     expect(result.status).toBe(201);
        //     expect(result).toHaveProperty('message');
        //     expect(result).toHaveProperty('networkNodes');
        // })

    })
})
