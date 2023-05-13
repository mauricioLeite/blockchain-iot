import { Block } from "./block"

export class Blockchain {
    //TODO: ainda vai ser injetado, mudar a tipagem para o tipo do adaptador
    storage: any
    difficulty = 2
    constructor(_storage: any) {
        this.storage = _storage
        this.#createGenesisBlock()
    }

    #createGenesisBlock(reference: Block | null = null) {
        //TODO: mudar a tipagem do blocksModel
        const blocksModel: any = this.storage.createBlockModels()
        if (blocksModel.countRows() == 0) {
            let genesisBlock: Block;
            if (!reference) {
                genesisBlock = new Block(0, [], "0", new Date())
                genesisBlock.hash = genesisBlock.computeHash()
            } else {
                delete reference.index
                //TODO: validar se isso está certo e se funciona
                genesisBlock = reference
            }
            this.storage.createBlockModels().insert(genesisBlock)
        }
    }

    chain() {
        return this.storage.createBlockModels().getAll()
    }

    lastBlock() {
        return this.storage.createBlockModels().last()
    }

    getBlock(_id: number) {
        const block = this.storage.createBlockModels().get({ id: _id })
        return block ? block : {}
    }

    mine(unconfirmedTransaction: any) {
        const lastBlock = this.lastBlock()
        const newBlock = new Block(
            lastBlock.index + 1,
            unconfirmedTransaction.transaction,
            lastBlock.hash
        )
        const proof = this.proofOfWork(newBlock)
        const id = this.addBlock(newBlock, proof)
        return id
    }

    proofOfWork(block: Block) {
        block.nonce = 0
        let computedHash = block.computeHash()
        //TODO: Update conditional to follow startsWith validation
        while (!computedHash.startsWith(this.difficulty.toString())) {
            block.nonce += 1
            computedHash = block.computeHash()
        }
        return computedHash
    }

    addBlock(block: Block, proof: string) {
        const previousHash = this.lastBlock().hash
        if (previousHash !== block.previousHash) return false
        if (!this.isValidProof(block, proof)) return false
        block.hash = proof
        //TODO: Validate if insert return inserted element id
        return this.storage.createBlockModels().insert(block)
    }

    isValidProof(block: Block, blockHash: string) {
        return (
            //TODO: Update check to follow startsWith validation
            blockHash.startsWith(this.difficulty.toString()) &&
            blockHash === block.computeHash()
        )
    }

    // Blockchain Consensus Logic Methods
    checkChainValidity(chain: any[]) {
        let previousHash = this.getBlock(0).hash;
        for (const block of chain) {
            if (block.index == 0) continue;
            const blockHash = block.hash
            if (!blockHash) return false;
            
            delete block.id
            delete block.hash
            delete block.createdAt

            if (
                !this.isValidProof(
                    new Block(
                        block.index,
                        block.transaction,
                        block.previousHash,
                        block.createdAt,
                        block.nonce,
                        block.hash
                    ),
                    blockHash
                ) ||
                previousHash !== block.previousHash
            )
                return false
            block.hash = blockHash;
            previousHash = blockHash;
            
        }
        return true
    }

    createChainFromDump(chainDump: any[]) {
        this.storage.createBlockModels().delete()
        chainDump.forEach((blockData) => {
            if (blockData.index === 0) {
                this.#createGenesisBlock(blockData)
            } else {
                const proof = blockData.hash
                delete blockData.id
                delete blockData.hash
                delete blockData.createdAt
                const block = new Block(
                    blockData.index,
                    blockData.transaction,
                    blockData.previousHash,
                    blockData.createdAt,
                    blockData.nonce,
                )
                const added = this.addBlock(block, proof)
                if (!added) console.log("The chain dump is tampered!!")
            }
        })
        return this.chain()
    }
}
