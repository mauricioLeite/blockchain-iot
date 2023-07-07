import { Request, Response } from "express";
import { Registry } from "./registry.service";
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";

const storage = new DatabaseResourceFactory(new DatabaseConnector());

export class RegistryController {

    async get(_req: Request, res: Response) {
        const response = await new Registry(storage).list();
        return res.json( response );
    }

    async delete(_res: Request, res: Response) {
        const response = await new Registry(storage).clearLocal();
        return res.json( response );
    }

}
