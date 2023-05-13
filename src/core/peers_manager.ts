// Gerencia uma lista de pares de rede
export class PeersManager {
    storage: any

    constructor(storage: any) {
        this.storage = storage
    }

    /*
    Retorna uma lista formatada dos endereços IP dos pares de rede armazenados
  */
    list(): string[] {
        const peers = this.storage.getAll()
        const formatted: string[] = []
        for (const peer of peers) {
            formatted.push(peer.ip_address)
        }
        return formatted
    }

    /*
    Sincroniza uma lista de pares de rede com o armazenamento atual
  */
    syncPeers(peers: string[], host: string): boolean {
        for (const peer of peers) {
            if (peer !== host) {
                this.storage.createPeersModel().insert({ ip_address: peer })
            }
        }
        return true
    }
}
