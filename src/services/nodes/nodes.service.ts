import { DatabaseResourceFactory } from '@database';
import { Block, Blockchain, Peers } from '@core';

import axios from 'axios';

export class Nodes {
    #storage: DatabaseResourceFactory;

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage;
    }

    async newNode(payload: newAddress) {
        const newNodeAddr = payload.node_address;
        
        if (!newNodeAddr) return { message: 'Missing nodeAddress field!' , status: 401 };

        let networkNodes = await this.#listPeers();
        
        if (networkNodes.includes(newNodeAddr)) return { message: 'Address already registered!' , status: 409 };

        const peerModel = await this.#storage.createPeersResource();
        await peerModel.create({ ip_address: newNodeAddr });

        networkNodes = await this.#listPeers();
        const chain = await new Blockchain(this.#storage).chain();
        return { response: { message: "Registered successfully!", networkNodes, chain }, status: 201};
    }

    async joinNetwork(payload: { node_address: string }, host: string) {
        const nodeAddr = payload.node_address;

        if (!nodeAddr) {
            return { response: { message: 'Missing node_address field!'}, status: 401};
        }

        const data = { node_address: host };
        const headers = { 'Content-Type': 'application/json' };

        const options = {
            baseURL: `http://${nodeAddr}:3000`, 
            url: `/nodes/register`,
            method: 'POST',
            data,
            headers: headers 
        };

        const response = await axios.request(options);

        if (response.status === 201) {
            const { chain, networkNodes } = response.data;
            const blockchain = new Blockchain(this.#storage);
            const peers = new Peers(this.#storage);
            blockchain.createChainFromDump(chain);
            peers.syncPeers([nodeAddr, ...networkNodes], host);
            return { response: { message: 'Registration successful'}, status: 200};
        } else {
            return { response: { message: 'Error registering node in network.'}, status: 500};
        }
    }

    async syncBlock(block: Block) {
        const proof = block.hash;
        delete block.hash;

        const blockchain = new Blockchain(this.#storage);
        const added = blockchain.addBlock(block, proof!);

        if (!added) return { message: 'The block is discarded by the node.' , status: 500};

        return { message: 'Block added to the chain' , status:  201};
    }

    async #listPeers() {
        const peersInstance = new Peers(this.#storage);
        return await peersInstance.list();
    }   

}

interface newAddress {
    node_address: string
}       