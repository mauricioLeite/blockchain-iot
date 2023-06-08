import { PendingTransactions as PendingTransactionsEntity } from "../entities/pending_transactions.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Strategy } from "./strategy";

export class PendingTransactions extends Strategy {

    constructor(databaseConnector: DatabaseConnector) {
        super(databaseConnector);
        this.entity = PendingTransactionsEntity;
    }

}   