import { Block } from "./block";
import { PendingTransactions } from "./pending_transactions";
import { Peers } from "./peers";

import { DatabaseConnector } from "../DatabaseConnector";

export class DatabaseResourceFactory {
    #databaseConnector: DatabaseConnector;

    constructor(databaseConnector: DatabaseConnector) {
        this.#databaseConnector = databaseConnector;
    }

    createBlockResource() {
        return new Block(this.#databaseConnector);
    }

    createPeersResource() {
        return new Peers(this.#databaseConnector);
    }

    createPendingTransactionsResource() {
        return new PendingTransactions(this.#databaseConnector);
    }

}