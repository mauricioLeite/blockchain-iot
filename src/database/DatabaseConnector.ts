import "reflect-metadata";
import { DataSource } from "typeorm"
import ormConfig  from "./ormconfig"


export class DatabaseConnector {
    #connection: DataSource
    
    async getConnection() : Promise<DataSource> {
        if ( !this.#connection ) await this.#createConnection();
        return this.#connection;
    }
    
    async #createConnection() {
        const connection = new DataSource(ormConfig)

        await connection.initialize().catch(err => {
            console.log(err);
            return null;
        });
        
        this.#connection = connection;
    }

}