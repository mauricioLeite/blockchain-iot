import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { Peers } from "./peers";

import { DatabaseResourceFactory } from "@database";

export class CoreFactory {
    #storage: DatabaseResourceFactory;

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage;
    }

    async createBlockchain() {
        return await this.#initializeResource(Blockchain, true);
    }

    async createPeers() {
        return await this.#initializeResource(Peers);
    }

    // async createBlock() {
    //     return await this.#initializeResource(Block);
    // }

    async #initializeResource(ResourceType: any, init = false) {
        const resource = new ResourceType(this.#storage);
        if(init) await resource.init();
        return resource;
    }

}