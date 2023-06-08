import { Block } from "../core/block";

import { Axios } from 'axios';
export class MineService {
    storage: any
    library: any

    constructor(
        storage: any,
        library: any
    ) {
        this.storage = storage
        this.library = library
    }

    /*
    Mineração de blocos
  */
    mine() {
        const transaction = this.storage
            .createPendingTransactionsModel()
            .first()
        if (!transaction) {
            return {
                message: "No transaction available.",
                status: 200,
            }
        }

        const blockchain = this.library.createBlockchain()
        const minedBlockId = blockchain.mine(transaction)
        if (!minedBlockId) {
            return {
                message: "Error on mining process.",
                status: 500,
            }
        }

        const chainLength = blockchain.chain.length
        this.consensus()
        if (chainLength === blockchain.chain.length) {
            this.announceNewBlock(blockchain.lastBlock)
            this.storage
                .createPendingTransactionsModel()
                .delete({ id: transaction.id })
        }

        return {
            block: blockchain.lastBlock,
            status: 200,
        }
    }

    /*
    Alcançar o consenso entre os pares da rede
  */
    async consensus() {
        let longestChain = null
        let currentLen = this.library.createBlockchain().chain.length
        const peers = this.storage.createPeersModel().getAll()
        for (const node of peers) {
            const options = {
                method: 'GET',
                url: `http://${node.ip_address}/registry`, 
            };

            const client = new Axios()
            const response = await client.request(options);
            const length = response.data.length
            const chain = response.data.chain
            if (
                length > currentLen &&
                this.library.createBlockchain().checkChainValidity(chain)
            ) {
                currentLen = length
                longestChain = chain
            }
        }
        if (longestChain) {
            this.library.createBlockchain().createChainFromDump(longestChain)
        }
		return
    }

    /*
    Anunciar a inclusão de um novo bloco aos pares da rede
  */
    async announceNewBlock(block: Block) {
        if ("createdAt" in block) delete block.createdAt
        const peers = this.storage.createPeersModel().getAll()
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