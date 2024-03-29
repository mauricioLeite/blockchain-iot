import { Devices } from "./devices";
import { PendingTransactions } from "./pending_transactions";
import { Peers } from "./peers";

import { DatabaseConnector } from "../DatabaseConnector";

export class DatabaseResourceFactory {
    #databaseConnector: DatabaseConnector;

    constructor(databaseConnector: DatabaseConnector | null = null) {
        this.#databaseConnector = databaseConnector ?? new DatabaseConnector();
    }

    async createDevicesResource() {
        return await this.#initializeResource(Devices);
    }

    async createPeersResource() {
        return await this.#initializeResource(Peers);
    }

    async createPendingTransactionsResource() {
        return await this.#initializeResource(PendingTransactions);
    }

    async #initializeResource(ResourceType: any) {
        const resource = new ResourceType(this.#databaseConnector);
        await resource.init();
        return resource;
    }

}