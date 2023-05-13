import { DatabaseConnector, PeersEntity } from "@database";
import { Repository } from "typeorm";

export class Peers {
    #databaseConnector: DatabaseConnector;
    #peersRepository: Repository<PeersEntity>;

    constructor(databaseConnector: DatabaseConnector) {
        this.#databaseConnector = databaseConnector;
    }

    async init() {
        if (this.#peersRepository) return false;
        const connection = await this.#databaseConnector.getConnection();
        this.#peersRepository = connection.getRepository(PeersEntity);
        return true;
    }

    async create(block: PeersEntity) {
        return await this.#peersRepository.insert(block);
    }

    async findByIp(ip: string) : Promise<PeersEntity | null> {
        return await this.#peersRepository.findOne({ where : { ip_address: ip } });
    }

}   