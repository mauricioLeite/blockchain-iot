import { Devices as DevicesEntity } from "../entities/devices.entity";
import { DatabaseConnector } from "../DatabaseConnector";
import { Strategy } from "./strategy";

export class Devices extends Strategy {

    constructor(databaseConnector: DatabaseConnector) {
        super(databaseConnector);
        this.entity = DevicesEntity;
    }

}   