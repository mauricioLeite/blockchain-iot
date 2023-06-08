import { Peers as PeersEntity } from "../entities/peers.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Strategy } from "./strategy";

export class Peers extends Strategy {
    
    constructor(databaseConnector: DatabaseConnector) {
        super(databaseConnector);
        this.entity = PeersEntity;
    }

    async findByIp(ip: string) : Promise<PeersEntity | null> {
        return await this.repository.findOne({ where : { ip_address: ip } });
    }

}   