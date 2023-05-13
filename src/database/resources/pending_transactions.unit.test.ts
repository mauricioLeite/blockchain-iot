import { PendingTransactions } from "./pending_transactions"
import { PendingTransactions as PendingTransactionsEntity } from "../entities/pending_transactions.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { InsertResult } from "typeorm";

describe("resource Peers", () => {

    describe("#init", () => {
        const instance = new PendingTransactions(new DatabaseConnector());

        const pendingTransactionsData = { 
            transaction_data : '{data: "test"}'
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
            const result = await instance.next();

            expect(result).toBeInstanceOf(PendingTransactionsEntity);
            expect(result?.transaction_data).toEqual(pendingTransactionsData.transaction_data);

        });
    })
})
