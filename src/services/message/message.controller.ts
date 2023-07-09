import { Message } from './message.service';
import { DatabaseResourceFactory } from "@database";
import { DatabaseConnector } from "@database/DatabaseConnector";
import { ForwardMessage, Logger } from '@utils';
import { CoreFactory } from "@core/factory";

const storage = new DatabaseResourceFactory(new DatabaseConnector());
const core = new CoreFactory(storage);

export class MessageController {

    async processMessage (topic: string, message: any, packet: any) {
        message = JSON.parse(message.toString());
        
        const logger = new Logger('message.controller.ts', '/services/message');
        logger.info({ message, topic, action: "CONSUME"});

        const { response, target } = await new Message(storage, core).processMessage(message);
        const client = new ForwardMessage(target);
        client.publishMessage(response);
    }

}
