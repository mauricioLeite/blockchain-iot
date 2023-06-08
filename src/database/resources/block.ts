import { Block as BlockEntity } from "../entities/block.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Strategy } from "./strategy";

export class Block extends Strategy {

    constructor(databaseConnector: DatabaseConnector) {
        super(databaseConnector);
        this.entity = BlockEntity;
    }

}   