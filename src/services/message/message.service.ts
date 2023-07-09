import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";
import { HTTPRequest } from "@utils";
import { Logger } from "@utils";

export class Message {
    #storage: DatabaseResourceFactory
    #core: CoreFactory

    constructor( storage: DatabaseResourceFactory, core: CoreFactory ) {
        this.#storage = storage;
        this.#core = core;
    }

    async processMessage(message: any) {
        return { response: message.message , target: message.toDevice };
    }

}