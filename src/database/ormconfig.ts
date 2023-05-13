import path from "path";
import { DataSourceOptions } from "typeorm";

const DSOptions: DataSourceOptions = {
    type: "better-sqlite3",
    database: "data/localbase.sqlite",
    entities: [path.join(__dirname, "**", "entities", "*.entity.{js,ts}")],
    migrationsTableName: "migrations",
    migrations: [path.join(__dirname, "**", "migrations", "*.{js,ts}")]
}

export default DSOptions