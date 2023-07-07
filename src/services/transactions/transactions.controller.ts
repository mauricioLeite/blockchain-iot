import { Request, Response } from "express";
import { Transactions } from "./transactions.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";

const storage = new DatabaseResourceFactory(new DatabaseConnector());

export class TransactionsController {

    async get(_req: Request, res: Response) {
        const response = await new Transactions(storage).pending();
        return res.json( response );
    }

}
