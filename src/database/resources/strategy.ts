import { DatabaseConnector } from "../DatabaseConnector";
import { Repository } from "typeorm";

export class Strategy {
    #databaseConnector: DatabaseConnector;

    protected repository: Repository<any>;
    protected entity: any;

    constructor(databaseConnector: DatabaseConnector) {
        this.#databaseConnector = databaseConnector;
    }

    async init() {
        if (this.repository) return false;
        const connection = await this.#databaseConnector.getConnection();
        this.repository = connection.getRepository(this.entity);
        return true;
    }

    async create(block: any) {
        return await this.repository.insert(block);
    }

    async findById(id: number) : Promise<any | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async getAll(where: object) {
        return await this.repository.find({ where });
    }
    
    async next() : Promise<any | null> {
        return await this.repository.findOne({ where: {}});
    }

    async countRows(where: object) {
        return await this.repository.count({ where });
    }

    async truncateTests(){
        return await this.repository.clear();
    }
}   