import { DatabaseResourceFactory } from "@database";

export class Transactions {
    #storage: DatabaseResourceFactory

    constructor(storage: any) {
        this.#storage = storage
    }

    async create (payload: any) {
        const transactionModel = await this.#storage.createPendingTransactionsResource();
        const inserted = await transactionModel.create({ transaction: payload });
        
        if (inserted)   return { message: "Transaction requested!", status: 201 };
        return { message: "Internal Error", status: 500 };
    }

    async pending() {
        const transactionModel = await this.#storage.createPendingTransactionsResource();
        const pendingTransaction = await transactionModel.getAll();

        if (!pendingTransaction)   return { message: "Internal Error", status: 500 };
        return {
            unconfirmedTransactions: pendingTransaction,
            length: pendingTransaction.length,
            status: 200,
        };
    }
}
