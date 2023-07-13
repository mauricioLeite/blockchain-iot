import { PendingTransactions } from "./pending_transactions"
import { PendingTransactions as PendingTransactionsEntity } from "../entities/pending_transactions.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { InsertResult } from "typeorm";

describe("resource Transactions", () => {

    describe("#init", () => {
        const instance = new PendingTransactions(new DatabaseConnector());

        const pendingTransactionsData = { 
            transaction_data : '{"uuid":"e270a4a8-c4f3-4373-a7e5-109eb8e723e2"}'
        };

        it("should init", async () => {
            const result = await instance.init();
            
            expect(typeof result === 'boolean').toBeTruthy();
            expect(result).toBe(true);
        })

        //  Create new resource on Database - use carefully    
        it("should create a pending_transaction entry", async () => {
            const result = await instance.create(pendingTransactionsData as PendingTransactionsEntity);
            expect(result).toBeInstanceOf(InsertResult);
        })

        it("should recover next pending transaction", async () => {
            const result = await instance.first();

            expect(result).toBeInstanceOf(PendingTransactionsEntity);
            expect(JSON.stringify(result?.transaction_data)).toEqual(pendingTransactionsData.transaction_data);

        });

        it("should delete a transaction by Id", async () => {
            const result = await instance.deleteById(20);
            expect(typeof result).toBe("number");
        });
    })
})
