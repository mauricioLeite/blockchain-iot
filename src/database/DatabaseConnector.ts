import "reflect-metadata";
import { DataSource } from "typeorm"
import ormConfig  from "./ormconfig"


export class DatabaseConnector {
    
    async createConnection() {
        const connection = new DataSource(ormConfig)

        return connection.initialize().catch(err => {
            console.log(err);
            return null;
        });
    }
}