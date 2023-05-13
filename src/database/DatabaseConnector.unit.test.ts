import { DataSource } from "typeorm";
import { DatabaseConnector } from "./DatabaseConnector"

describe("DatabaseConnector", () => {
    const DBConnector = new DatabaseConnector();
    test("get connection", async () => {
        expect(await DBConnector.getConnection()).toBeInstanceOf(DataSource);
    });
})
