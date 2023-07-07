import { Request, Response } from "express";
import { Nodes } from "./nodes.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";

const storage = new DatabaseResourceFactory(new DatabaseConnector());

export class NodesController {

    async get(_req: Request, res: Response) {
        const response = {};
        return res.json( response );
    }

}
