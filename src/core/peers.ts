import { DatabaseResourceFactory } from "@database";

export class Peers {
    storage: DatabaseResourceFactory

    constructor(storage: DatabaseResourceFactory) {
        this.storage = storage
    }

    /*
    Retorna uma lista formatada dos endereços IP dos pares de rede armazenados
  */
    async list(): Promise<string[]> {
        const peersModel = await this.storage.createPeersResource();
        const formatted: string[] = [];
        
        const peers = await peersModel.getAll();
        for (const peer of peers) {
            formatted.push(peer.ip_address)
        }
        return formatted
    }

    /*
    Sincroniza uma lista de pares de rede com o armazenamento atual
  */
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
