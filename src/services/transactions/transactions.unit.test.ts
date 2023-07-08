import { Transactions  } from "./transactions.service";
import { DatabaseResourceFactory } from "@database";

import { generateRandomMacAddress } from "@utils/generate";

describe("Transactions Service", () => {

    describe("#init", () => {
        const instance: Transactions = new Transactions(new DatabaseResourceFactory());
        
        it("should create a transaction", async () => {
            const transaction: object = { macAddress: generateRandomMacAddress() };
            const result = await instance.create(transaction);
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(201);
        })

        it("should list the pending transactions", async () => {
            const result = await instance.pending();
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(200);
        })

    })
})
