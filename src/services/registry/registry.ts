import { DatabaseResourceFactory } from "@database"
import { Blockchain, Peers } from "@core";
export class Registry {
    #storage: DatabaseResourceFactory

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage
    }

    async list() {
        const blockchain = new Blockchain(this.#storage);
        const peersInstance = new Peers(this.#storage);
        const peers = await peersInstance.list();
        const chain = await blockchain.chain();

        return { chain: chain, peers: peers, length: chain.length, status: 200 }
    }
}
