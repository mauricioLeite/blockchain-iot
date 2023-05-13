import { DatabaseConnector, PendingTransactionsEntity } from "@database";
import { Repository } from "typeorm";

export class PendingTransactions {
    #databaseConnector: DatabaseConnector;
    #pendingTransactionsRepository: Repository<PendingTransactionsEntity>;

    constructor(databaseConnector: DatabaseConnector) {
        this.#databaseConnector = databaseConnector;
    }

    async init() {
        if (this.#pendingTransactionsRepository) return false;
        const connection = await this.#databaseConnector.getConnection();
        this.#pendingTransactionsRepository = connection.getRepository(PendingTransactionsEntity);
        return true;
    }

    async create(block: PendingTransactionsEntity) {
        return await this.#pendingTransactionsRepository.insert(block);
    }

    async next() : Promise<PendingTransactionsEntity | null> {
        return await this.#pendingTransactionsRepository.findOne({ where: {}});
    }

}   