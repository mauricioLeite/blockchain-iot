import path from "path";
import { DataSourceOptions } from "typeorm";

const DSOptions: DataSourceOptions = {
    type: "better-sqlite3",
    database: "data/localbase.sqlite",
    entities: [path.join("**", "entities", "*.entity.{js,ts}")],
    migrationsTableName: "migrations",
    migrations: ["dist/database/migrations/*.js"]
}

export default DSOptions