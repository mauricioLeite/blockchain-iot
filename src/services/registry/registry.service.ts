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

    /*
     Limpa o armazenamento local de pares e blocos
    */
     public async clearLocal() {
        const peersModel = await this.#storage.createPeersResource();
        const blockModel = await this.#storage.createDevicesResource();
        
        peersModel.truncate();
        blockModel.truncate();

        return { message: 'Clear complete!' , status: 200};
    }
}
