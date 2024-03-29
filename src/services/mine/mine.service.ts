import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";
import { HTTPRequest } from "@utils";
import { Logger } from "@utils";
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
        
        let chain = await blockchain.chain();
        const originalLength = chain.length;

        await this.consensus(originalLength);
        const lastBlock = await blockchain.lastBlock();

        chain = await blockchain.chain();
        const afterConsensusLength = chain.length;

        if (originalLength === afterConsensusLength) {
            await this.announceNewBlock(lastBlock);
            await transactionsModel.deleteById(transaction.id);
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
        const peers = await peersModel.getAll();

        const client = new HTTPRequest('');
        for (const node of peers) {
            client.baseURL = `http://${node.ip_address}`;
            const response = await client.get(`/registry`);
            const length = response.data.chain_length
            const chain = response.data.chain
            if ( length > longestChainLength && await blockchain.checkChainValidity(chain) ) {
                longestChainLength = length
                longestChain = chain
            }
        }

        if (longestChain) await blockchain.createChainFromDump(longestChain);
        
		return
    }

    async announceNewBlock(block: any) {
        for (const key of Object.keys(block)) {
            if (!['index','transaction','nonce','previous_hash', 'hash'].includes(key)) delete block[key];
        }

        const peersModel = await this.#storage.createPeersResource();
        const peers = await peersModel.getAll();
        
        if (!peers) return;

        const client = new HTTPRequest('');
        const data = { block };
        
        for (const node of peers) {
            client.baseURL = `http://${node.ip_address}`
            try {
                const response = await client.post(`/nodes/sync_block`, data);
            } catch(error) {
                const logger = new Logger('mine.service.ts', '/services/mine');
                logger.info({ error: error.response });
            }
        }
    }
}