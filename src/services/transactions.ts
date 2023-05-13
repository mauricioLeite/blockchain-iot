export class Transactions {
    storage: any

    constructor(_storage: any) {
        this.storage = _storage
    }

    create(payload: any) {
        const inserted = this.storage
            .createPendingTransactionsModel()
            .insert({ transaction: payload })
        if (inserted)
            return { message: "Transaction requested!", status: 201 }

        return { message: "Internal Error", status: 500 }
    }

    pending() {
        const pendingTx = this.storage.createPendingTransactionsModel().getAll()
        return {
            unconfirmedTransactions: pendingTx,
            length: pendingTx.length,
            status: 200,
        }
    }
}
