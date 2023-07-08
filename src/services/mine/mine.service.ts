import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";

import { HTTPRequest } from "@utils";
export class Mine {
    #storage: DatabaseResourceFactory
    #core: CoreFactory

    constructor( storage: DatabaseResourceFactory, core: CoreFactory ) {
        this.#storage = storage;
        this.#core = core;
    }

    async mine() {
        const transactionsModel = await this.#storage.createPendingTransactionsResource();
        const transaction = await transactionsModel.first();
        if (!transaction) return { response: { message: "No transaction available." }, status: 200}
        
        const blockchain = await this.#core.createBlockchain();
        const minedBlockId = await blockchain.mine(transaction);
        if (!minedBlockId)  return { response: { message: "Error on mining process." }, status: 500 };
        
        const chain = await blockchain.chain();
        const chainLength = chain.length;

        await this.consensus(chainLength);
        const lastBlock = await blockchain.lastBlock();
        return { response: {message:"TESTING"}, status: 404 };
        if (chainLength === blockchain.chain.length) {
            await this.announceNewBlock(lastBlock);

            const transactionModel = await this.#storage.createPendingTransactionsResource();
            transactionModel.deleteById(transaction.id);
        }

        return {
            response: { block: lastBlock },
            status: 200,
        }
    }

    async consensus(chainCurrentLength: number) {
        const blockchain = await this.#core.createBlockchain();
        const peersModel = await this.#storage.createPeersResource();
        let longestChain = null;

        let longestChainLength = chainCurrentLength;
        const peers = peersModel.getAll();

        const client = new HTTPRequest('');
        for (const node of peers) {
            client.baseURL = `http://${node.ip_address}`;
            const response = await client.get(`/registry`);

            const length = response.data.length
            const chain = response.data.chain
            if ( length > longestChainLength && await blockchain.checkChainValidity(chain) ) {
                longestChainLength = length
                longestChain = chain
            }
        }
        if (longestChain) {
            await blockchain.createChainFromDump(longestChain);
        }
		return
    }

    async announceNewBlock(block: Block) {
        for (const key of Object.keys(block)) {
            if (!['index','transaction','nonce','previous_hash', 'hash'].includes(key)) delete block[key as keyof Block];
        }

        const peersModel = await this.#storage.createPeersResource();
        const peers = peersModel.getAll();

        const options: ClientOptions = {
            method: 'POST',
            params: { json: JSON.stringify(block) },
        };
        const client = new Axios()
        
        for (const node of peers) {
            options.url = `http://${node.ip_address}/node/sync_block`;
            await client.request(options); 
        }
    }
}

interface ClientOptions {
    method: string,
    url?: string,
    params?: object,
    headers?: object
}