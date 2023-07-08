import { DatabaseResourceFactory } from "@database";

export class Peers {
    storage: DatabaseResourceFactory

    constructor(storage: DatabaseResourceFactory) {
        this.storage = storage
    }

    async list(): Promise<string[]> {
        const peersModel = await this.storage.createPeersResource();
        const formatted: string[] = [];
        
        const peers = await peersModel.getAll();
        for (const peer of peers) {
            formatted.push(peer.ip_address)
        }
        return formatted
    }

    async syncPeers(peers: string[], host: string): Promise<boolean> {
        const peersModel = await this.storage.createPeersResource();
        for (const peer of peers) {
            if (peer !== host) {
                peersModel.create({ ip_address: peer })
            }
        }
        return true
    }
}
