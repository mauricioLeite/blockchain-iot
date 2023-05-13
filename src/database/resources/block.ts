import { Block as BlockEntity } from "../entities/block.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Repository } from "typeorm";

export class Block {
    #databaseConnector: DatabaseConnector;
    #blockRepository: Repository<BlockEntity>;

    constructor(databaseConnector: DatabaseConnector) {
        this.#databaseConnector = databaseConnector;
    }

    async init() {
        if (this.#blockRepository) return false;
        const connection = await this.#databaseConnector.getConnection();
        this.#blockRepository = connection.getRepository(BlockEntity);
        return true;
    }

    async create(block: BlockEntity) {
        return await this.#blockRepository.insert(block);
    }

    async findById(id: number) : Promise<BlockEntity | null> {
        return await this.#blockRepository.findOne({ where: { id } });
    }

}   