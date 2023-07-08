import { Request, Response } from "express";
import { Nodes } from "./nodes.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { Logger } from "@utils";

const storage = new DatabaseResourceFactory(new DatabaseConnector());

export class NodesController {

    async post_register(req: Request, res: Response) {
        const logger = new Logger('nodes.controller.ts', '/services/nodes');
        logger.info({...req.body, method: "POST_register"});

        const { response, status } = await new Nodes(storage).newNode(req.body);
        res.status(status);
        return res.json( response );
    }

    async post_join(req: Request, res: Response) {
        const logger = new Logger('nodes.controller.ts', '/services/nodes');
        logger.info({...req.body, method: "POST_join"});

        const { response, status } = await new Nodes(storage).joinNetwork(req.body, req.hostname);
        res.status(status);
        return res.json( response );
    }

}
