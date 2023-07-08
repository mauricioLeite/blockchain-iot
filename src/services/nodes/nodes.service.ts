import { DatabaseResourceFactory } from '@database';
import { Block, Blockchain, Peers } from '@core';

import { Axios } from 'axios';

export class Nodes {
    #storage: DatabaseResourceFactory;

    constructor(storage: DatabaseResourceFactory) {
        this.#storage = storage;
    }

    public async newNode(payload: newAddress) {
        const newNodeAddr = payload.nodeAddress;
        
        if (!newNodeAddr) return { message: 'Missing nodeAddress field!' , status: 401 };

        const networkNodes = await this.#listPeers();
        
        if (networkNodes.includes(newNodeAddr)) return { message: 'Address already registered!' , status: 409 };

        const peerModel = await this.#storage.createPeersResource();
        await peerModel.create({ ip_address: newNodeAddr });

        const actualNetworkNodes = await this.#listPeers();
        return { "message": "Registered successfully!", status: 201, networkNodes: actualNetworkNodes };
    }

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

    public async syncBlock(block: Block) {
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
    nodeAddress: string
}       