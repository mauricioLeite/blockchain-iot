import { request } from "https";

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
    consensus() {
        let longestChain = null
        let currentLen = this.library.createBlockchain().chain.length
        const peers = this.storage.createPeersModel().getAll()
        for (const node of peers) {
            const response = request.get(`http://${node.ip_address}/registry`)
            const length = response.json().length
            const chain = response.json().chain
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
    announceNewBlock(block: object) {
        if ("created_at" in block) delete block["created_at"]
        const peers = this.storage.createPeersModel().getAll()
        for (const node of peers) {
            request.post(`http://${node.ip_address}/node/sync_block`, {
                json: JSON.stringify(block),
            })
        }
    }
}
