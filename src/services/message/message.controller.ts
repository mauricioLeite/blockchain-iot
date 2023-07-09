import { Request, Response } from "express";
import { Message } from './message.service';
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { Logger } from '@utils';
import { CoreFactory } from "@core/factory";

const storage = new DatabaseResourceFactory(new DatabaseConnector());
const core = new CoreFactory(storage);

export class MessageController {

    async post (topic: string, message: any, packet: any) {
        const logger = new Logger('message.controller.ts', '/services/message');
        message = JSON.parse(message);
        logger.info({...message, topic});

        const { response, target } = await new Message(storage, core).processMessage(message);
        
        console.log(response, target);
    }

}
