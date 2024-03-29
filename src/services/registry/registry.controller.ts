import { Request, Response } from "express";
import { Registry } from "./registry.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { Logger } from "@utils";
import { CoreFactory } from "@core";

const storage = new DatabaseResourceFactory(new DatabaseConnector());
const core = new CoreFactory(storage);

export class RegistryController {

    async get(_req: Request, res: Response) {
        const { response, status } = await new Registry(storage, core).list();
        res.status(status);
        return res.json( response );
    }

    async delete(_res: Request, res: Response) {
        const logger = new Logger('registry.controller.ts', '/services/registry');
        logger.info({ method: "DELETE" });

        const { response, status } = await new Registry(storage).clearLocal();
        res.status(status);
        return res.json( response );
    }

}
