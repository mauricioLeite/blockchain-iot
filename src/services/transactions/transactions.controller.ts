import { Request, Response } from "express";
import { Transactions } from "./transactions.service";

import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { Logger } from "@utils";

const storage = new DatabaseResourceFactory(new DatabaseConnector());

export class TransactionsController {

    async get(_req: Request, res: Response) {
        const response = await new Transactions(storage).pending();
        return res.json( response );
    }

    async post(req: Request, res: Response) {
        const logger = new Logger('transactions.controller.ts', '/services/transactions');
        logger.info({...req.body, method: "POST"});
        
        const { response, status} = await new Transactions(storage).create(req.body);
        res.status(status);
        return res.json( response );
    }

}
