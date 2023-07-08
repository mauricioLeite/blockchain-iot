import { DatabaseResourceFactory } from "@database";

export class Transactions {
    #storage: DatabaseResourceFactory

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage
    }

    async create (payload: any) {
        const transactionModel = await this.#storage.createPendingTransactionsResource();
        const inserted = await transactionModel.create({ transaction_data: JSON.stringify(payload) });
        
        if (inserted)   return { response: { message: "Transaction requested!" }, status: 201 };
        return { response: { message: "Internal Error" }, status: 500 };
    }

    async pending() {
        const transactionModel = await this.#storage.createPendingTransactionsResource();
        const pendingTransaction = await transactionModel.getAll();

        if (!pendingTransaction)   return { response: { message: "Internal Error" }, status: 500 };
        return {
            response : {
                unconfirmedTransactions: pendingTransaction,
                length: pendingTransaction.length
            },
            status: 200
        };
    }
}
