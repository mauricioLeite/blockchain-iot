import { DatabaseResourceFactory } from '@database';
import { Block, Blockchain, Peers } from '@core';
import { Registry } from './registry';

// Use another request library
import { Axios } from 'axios';

// Classe que lida com comunicação e armazenamento de dados relacionados à blockchain
export class Nodes {
    #storage: DatabaseResourceFactory;

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage;
    }

    /*
    Verifica se o endereço do novo nó está presente e, em caso afirmativo, adiciona o novo nó ao armazenamento de pares (peers) e retorna a lista de pares atualizada
    */
    public async newNode(payload: newAddress) {
        const newNodeAddr = payload.nodeAddress;
        
        if (!newNodeAddr) return { message: 'Missing nodeAddress field!' , status: 401 };
        
        const instance = new Registry(this.#storage);
        const networkNodes = (await instance.list()).peers;
        
        if (networkNodes.includes(newNodeAddr)) return { message: 'Address already registered!' , status: 409 };

        const peerModel = await this.#storage.createPeersResource();
        await peerModel.create({ ip_address: newNodeAddr });

        const actualNetworkNodes = (await instance.list()).peers;
        return { "message": "Registered successfully!", status: 201, networkNodes: actualNetworkNodes };
    }

    /*
    Verifica se o endereço do novo nó está presente e, em caso afirmativo, envia uma solicitação POST para o endereço especificado para registrar o novo nó
    */
    public async joinNetwork(payload: { node_address: string }, host: string) {
        const nodeAddr = payload.node_address;

        if (!nodeAddr) {
            return { message: 'Missing node_address field!' , status: 401};
        }

        const data = { node_address: host };
        const headers = { 'Content-Type': 'application/json' };

        const options = {
            method: 'POST',
            url: `http://${nodeAddr}/node/register`,
            params: data,
            headers: headers 
        };

        const client = new Axios()
        const response = await client.request(options);
        
        if (response.status === 200) {
            const responsePayload = response.data;
            const blockchain = new Blockchain(this.#storage);
            const peers = new Peers(this.#storage);
            blockchain.createChainFromDump(responsePayload.chain);
            peers.syncPeers([nodeAddr, ...responsePayload.peers], host);
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
        delete block.hash;

        const blockchain = new Blockchain(this.#storage);
        const added = blockchain.addBlock(block, proof!);

        if (!added) return { message: 'The block is discarded by the node.' , status: 500};

        return { message: 'Block added to the chain' , status:  201};
    }

    /*
     Limpa o armazenamento local de pares e blocos
    */
    public async clearLocal() {
        const peersModel = await this.#storage.createPeersResource();
        const blockModel = await this.#storage.createDevicesResource();
        
        peersModel.truncate();
        blockModel.truncate();

        return { message: 'Clear complete!' , status: 200};
    }
}

interface newAddress {
    nodeAddress: string
}       