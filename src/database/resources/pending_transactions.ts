import { PendingTransactions as PendingTransactionsEntity } from "../entities/pending_transactions.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Strategy } from "./strategy";

export class PendingTransactions extends Strategy {

    constructor(databaseConnector: DatabaseConnector) {
        super(databaseConnector);
        this.entity = PendingTransactionsEntity;
    }

    async first() : Promise<any | null> {
        const result = await this.repository.findOne({ where: {}});
        if (result) result.transaction_data = JSON.parse(result.transaction_data);
        return result;
    }

}   