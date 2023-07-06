import { DatabaseResourceFactory } from "@database";
import { Block, Blockchain } from "@core";

import { Axios } from 'axios';
export class Mine {
    #storage: DatabaseResourceFactory

    constructor( storage: DatabaseResourceFactory ) {
        this.#storage = storage;
    }

    /*
    Mineração de blocos
  */
    async mine() {
        const transactionsModel = await this.#storage.createPendingTransactionsResource();
        const transaction = transactionsModel.first();
        if (!transaction) {
            return {
                message: "No transaction available.",
                status: 200,
            }
        }

        const blockchain = new Blockchain(this.#storage);
        const minedBlockId = await blockchain.mine(transaction);
        if (!minedBlockId) {
            return {
                message: "Error on mining process.",
                status: 500,
            }
        }

        const chainLength = blockchain.chain.length
        await this.consensus();
        const lastBlock = await blockchain.lastBlock();
        if (chainLength === blockchain.chain.length) {
            await this.announceNewBlock(lastBlock);

            const transactionModel = await this.#storage.createPendingTransactionsResource();
            transactionModel.deleteById(transaction.id);
        }

        return {
            block: lastBlock,
            status: 200,
        }
    }

    /*
    Alcançar o consenso entre os pares da rede
  */
    async consensus() {
        const blockchain = new Blockchain(this.#storage);
        const peersModel = await this.#storage.createPeersResource();
        let longestChain = null;

        let currentLen = (await blockchain.chain()).length;
        const peers = peersModel.getAll();
        for (const node of peers) {
            const options = {
                method: 'GET',
                url: `http://${node.ip_address}/registry`, 
            };

            const client = new Axios()
            const response = await client.request(options);
            const length = response.data.length
            const chain = response.data.chain
            if ( length > currentLen && await blockchain.checkChainValidity(chain) ) {
                currentLen = length
                longestChain = chain
            }
        }
        if (longestChain) {
            await blockchain.createChainFromDump(longestChain);
        }
		return
    }

    /*
    Anunciar a inclusão de um novo bloco aos pares da rede
  */
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