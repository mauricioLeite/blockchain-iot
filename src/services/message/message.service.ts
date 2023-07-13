import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";
import { Logger } from "@utils";

export class Message {
    #storage: DatabaseResourceFactory
    #core: CoreFactory

    constructor( storage: DatabaseResourceFactory, core: CoreFactory ) {
        this.#storage = storage;
        this.#core = core;
    }

    async processMessage(message: any) {
        const blockchain = await this.#core.createBlockchain();
        const actualChain = await blockchain.chain();
        const validChain = await blockchain.checkChainValidity(actualChain);
        
        if (!validChain) return { response: "Chain is tampered!.", target: message.source };

        const blocksModel: any = await this.#storage.createDevicesResource();
        const sourceCheck = await blocksModel.find({ "uuid": message.source });
        const targetCheck = await blocksModel.find({ "uuid": message.target });
        
        if (!sourceCheck || !targetCheck) {
            return { response: "Unauthorized action.", target: message.source };
        }
        return { response: message.message, target: message.target };
        
    }

}