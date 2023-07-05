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

    async create(resource: any) {
        return await this.repository.insert(resource);
    }

    async findById(id: number) : Promise<any | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async find(where: object) : Promise<any | null> {
        return await this.repository.findOne({ where });
    }

    async getAll(where: object) {
        return await this.repository.find({ where });
    }
    
    async first() : Promise<any | null> {
        return await this.repository.findOne({ where: {}});
    }

    async last() : Promise<any | null> {
        return await this.repository.findOne({ where: {}, order: { id : "DESC" } });
    }

    async countRows(where: object) {
        return await this.repository.count({ where });
    }

    async truncate(){
        return await this.repository.clear();
    }
}   