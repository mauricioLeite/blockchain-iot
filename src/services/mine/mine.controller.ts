import { Request, Response } from "express";
import { Mine } from "./mine.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { Logger } from '@utils';
import { CoreFactory } from "@core/factory";

const storage = new DatabaseResourceFactory(new DatabaseConnector());
const core = new CoreFactory(storage);

export class MineController {

    async post(req: Request, res: Response) {
        const logger = new Logger('nodes.controller.ts', '/services/nodes');
        logger.info({...req.body, method: "POST_register"});

        const { response, status } = await new Mine(storage, core).mine();
        res.status(status);
        return res.json( response );
    }

}
