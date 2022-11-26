import { Block } from "./block"

export class Blockchain {
    //TODO: ainda vai ser injetado, mudar a tipagem para o tipo do adaptador
    storage: any
    constructor(_storage: any) {
        this.storage = _storage
        this.createGenesisBlock()
    }
    createGenesisBlock(reference: Block | null = null) {
        //TODO: mudar a tipagem do blocksModel
        const blocksModel: any = this.storage.createBlockModels()
        if (blocksModel.countRows() == 0) {
            if (!reference) {
                const genesisBlock = new Block(0, [], "0", new Date())
                genesisBlock.hash = genesisBlock.computeHash()
            } else {
                delete reference.index
                //TODO: validar se isso está certo e se funciona
                const genesisBlock = reference
                this.storage.createBlockModels().insert(genesisBlock)
            }
        }
    }
}
