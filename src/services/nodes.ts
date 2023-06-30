import { Registry } from './registry';
import { Block } from "./../core/block";

// Use another request library
import { Axios } from 'axios';

// Classe que lida com comunicação e armazenamento de dados relacionados à blockchain
export class Nodes {

    #storage: any;
    #library: any;

    constructor(storage: any, library: any) {
        this.#storage = storage;
        this.#library = library;
    }

    /*
    Verifica se o endereço do novo nó está presente e, em caso afirmativo, adiciona o novo nó ao armazenamento de pares (peers) e retorna a lista de pares atualizada
    */
    public async newNode(payload: newAddress) {
        const addr = payload.nodeAddress;

        if (!addr) {
            return { message: 'Missing node_address field!' , status: 401 };
        }

        //TODO: check if node exist before insert and communicate new nodes to peers
        const peerModel = await this.#storage.createPeersResource();
        await peerModel.create({ ip_address: addr });

        
        const instance = new Registry(this.#storage, this.#library);
        return await instance.list();
    }

    /*
    Verifica se o endereço do novo nó está presente e, em caso afirmativo, envia uma solicitação POST para o endereço especificado para registrar o novo nó
    */
    public async joinNetwork(payload: { node_address: string }, host: string) {
        const addr = payload.node_address;

        if (!addr) {
            return { message: 'Missing node_address field!' , status: 401};
        }

        const data = { node_address: host };
        const headers = { 'Content-Type': 'application/json' };

        const options = {
            method: 'POST',
            url: `http://${addr}/node/register`,
            params: data,
            headers: headers 
        };

        const client = new Axios()
        const response = await client.request(options);
        // const response = await request.post(`http://${addr}/node/register`, { data, headers });
        
        if (response.status === 200) {
            const responsePayload = response.data;
            this.#library.createBlockchain().createChainFromDump(responsePayload.chain);
            this.#library.createPeersManager().syncPeers([addr, ...responsePayload.peers], host);
            return { message: 'Registration successful' , status: 200};
        } else {
            return { message: 'Error registering node in network.' , status: 500};
        }
    }

    /*
    Tenta adicionar um bloco à cadeia de blocos
    */
    public async syncBlock(block: Block) {
        const proof = block.hash;
        delete block.id;
        delete block.hash;
        delete block.createdAt;

        const added = this.#library.createBlockchain().addBlock(block, proof);

        if (!added) {
            return { message: 'The block is discarded by the node.' , status: 500};
        }

        return { message: 'Block added to the chain' , status:  201};
    }

    /*
     Limpa o armazenamento local de pares e blocos
    */
    public async clearLocal() {
        this.#storage.createPeersModel().delete();
        this.#storage.createBlockModels().delete();
        return { message: 'Clear complete!' , status: 200};
    }
}

interface newAddress {
    nodeAddress: string
}