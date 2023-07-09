import { DatabaseResourceFactory } from "@database";
import { Block } from "./block"
import { Logger } from "@utils";

export class Blockchain {
    #storage: DatabaseResourceFactory
    #difficulty = 2
    constructor(_storage: DatabaseResourceFactory) {
        this.#storage = _storage
    }

    async init() {
        await this.#createGenesisBlock();
        return true;
    }

    async #createGenesisBlock(reference: Block | null = null) {
        const blocksModel: any = await this.#storage.createDevicesResource();
        if (await blocksModel.countRows() == 0) {
            let genesisBlock: Block;
            if (!reference) {
                genesisBlock = new Block(0, [], "0", new Date())
                genesisBlock.hash = this.proofOfWork(genesisBlock);
            } else {
                genesisBlock = reference;
            }

            await blocksModel.create(genesisBlock.databaseFormat())
        }
    }

    async chain(): Promise<Block[]> {
        const blocksModel: any = await this.#storage.createDevicesResource();
        return await blocksModel.getAll();
    }

    async lastBlock() : Promise<Block> {
        const blocksModel: any = await this.#storage.createDevicesResource();
        return await blocksModel.last();
    }

    async getBlock(id: number) {
        const blocksModel: any = await this.#storage.createDevicesResource();
        return await blocksModel.find({ "index": id });
    }

    async mine(unconfirmedTransaction: any) {
        const lastBlock = await this.lastBlock();
        const newBlock = new Block(
            lastBlock.index + 1,
            unconfirmedTransaction.transaction_data,
            lastBlock.hash!
        )
        const proof = this.proofOfWork(newBlock);
        return await this.addBlock(newBlock, proof);
    }

    proofOfWork(block: Block) {
        block.nonce = 0
        let computedHash = block.computeHash()
        while (!computedHash.startsWith("0".repeat(this.#difficulty))) {
            block.nonce += 1
            computedHash = block.computeHash()
        }

        return computedHash
    }

    async addBlock(block: Block, proof: string) {
        const lastBlock = await this.lastBlock();
        const previousHash = lastBlock.hash;

        if (previousHash !== block.previousHash) return false
        if (!this.isValidProof(block, proof)) return false
        block.hash = proof

        const blocksModel: any = await this.#storage.createDevicesResource();
        const blockId = await blocksModel.create(block.databaseFormat());
        return blockId.raw;
    }

    isValidProof(block: Block, blockHash: string) {
        return (
            blockHash.startsWith("0".repeat(this.#difficulty)) &&
            blockHash === block.computeHash()
        )
    }

    // Blockchain Consensus Logic Methods
    async checkChainValidity(chain: any[]) {
        const genesisBlock = await this.getBlock(0);
        let previousHash = genesisBlock.hash;
        for (const block of chain) {
            if (block.index == 0) continue;
            const blockHash = block.hash
            if (!blockHash) return false;
            
            delete block.id
            delete block.hash
            delete block.createdAt

            const actualBlock =  new Block(block.index, block.transaction, block.previous_hash);
            actualBlock.nonce = block.nonce;
            
            if ( !this.isValidProof(actualBlock , blockHash) || previousHash !== actualBlock.previousHash )
                return false

            block.hash = blockHash;
            previousHash = blockHash;
            
        }
        return true
    }

    async createChainFromDump(chainDump: any[]) {
        const blocksModel: any = await this.#storage.createDevicesResource();
        await blocksModel.truncate();
        for (const blockData of chainDump) {
            if (blockData.index === 0) {
                delete blockData.id;
                const refereceBlock = Block.createFromObject(blockData);
                await this.#createGenesisBlock(refereceBlock);
            } else {
                const proof = blockData.hash

                delete blockData.id
                delete blockData.hash
                delete blockData.created_at
                
                const refereceBlock = new Block(blockData.index, blockData.transaction, blockData.previous_hash);
                refereceBlock.nonce = blockData.nonce;
                
                const added = await this.addBlock(refereceBlock, proof)
                if (!added) {
                    const logger = new Logger('blockchain.ts', '/core');
                    logger.info({ message: "The chain dump is tampered!!" });
                }
            }
        }
        return this.chain()
    }
}
