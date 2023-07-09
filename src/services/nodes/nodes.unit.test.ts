import { Nodes  } from "./nodes.service";
import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";

describe("Nodes Service", () => {

    describe("#init", () => {
        const storage = new DatabaseResourceFactory();
        const instance: Nodes = new Nodes(storage, new CoreFactory(storage));

        it("should add a new node to network", async () => {
            const payload = { node_address: "123.456.789.101"};
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
