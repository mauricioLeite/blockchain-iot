import { DatabaseResourceFactory } from "@database"
import { CoreFactory } from "@core";

export class Registry {
    #storage: DatabaseResourceFactory
    #core: CoreFactory | null

    constructor(storage: DatabaseResourceFactory, core: CoreFactory | null = null) {
        this.#storage = storage
        this.#core = core
    }

    async list() {
        const blockchain = await this.#core!.createBlockchain();
        const peersInstance = await this.#core!.createPeers();
        const transactionModel = await this.#storage.createPendingTransactionsResource();

        const chain = await blockchain.chain();
        const peers = await peersInstance.list();
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
