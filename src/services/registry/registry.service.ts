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
        const transactionModel = await this.#storage.createPendingTransactionsResource();

        const peers = await peersInstance.list();
        const chain = await blockchain.chain();
        const transactions = await transactionModel.getAll();

        return { 
            response: { chain, peers, transactions, chain_length: chain.length},
            status: 200 
        }
    }

    /*
     Limpa o armazenamento local de pares e blocos
    */
     public async clearLocal() {
        const peersModel = await this.#storage.createPeersResource();
        const blockModel = await this.#storage.createDevicesResource();
        const transactionModel = await this.#storage.createPendingTransactionsResource();
        
        peersModel.truncate();
        blockModel.truncate();
        transactionModel.truncate();

        return { response: { message: 'Clear complete!' }, status: 200};
    }
}
