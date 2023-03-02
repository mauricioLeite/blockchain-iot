export class Registry {
    storage: any
    library: any

    constructor(_storage: any, _library: any) {
        this.storage = _storage
        this.library = _library
    }

    list(id: string | number | undefined = undefined) {
        const peers = this.library.createPeersManager().list()
        const blockchain = this.library.createBlockchain()
        let chain
        if (id) {
            chain = blockchain.getBlock(id)
        } else {
            chain = blockchain.chain
        }
        return { chain: chain, peers: peers, length: chain.length, status: 200 }
    }
}
