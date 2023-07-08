import { DatabaseResourceFactory } from '@database';
import { CoreFactory } from '@core';

import { HTTPRequest } from '@utils';

export class Nodes {
    #storage: DatabaseResourceFactory;
    #core: CoreFactory

    constructor(storage: DatabaseResourceFactory, core: CoreFactory) {
        this.#storage = storage;
        this.#core = core;
    }

    async newNode(payload: newAddress) {
        const newNodeAddr = payload.node_address;
        
        if (!newNodeAddr) return { message: 'Missing nodeAddress field!' , status: 401 };

        let networkNodes = await this.#listPeers();
        
        if (networkNodes.includes(newNodeAddr)) return { message: 'Address already registered!' , status: 409 };

        const peerModel = await this.#storage.createPeersResource();
        await peerModel.create({ ip_address: newNodeAddr });

        networkNodes = await this.#listPeers();
        const blockchain = await this.#core.createBlockchain();
        const chain = await blockchain.chain();
        return { response: { message: "Registered successfully!", networkNodes, chain }, status: 201};
    }

    async joinNetwork(payload: { node_address: string }, host: string) {
        const nodeAddr = payload.node_address;

        if (!nodeAddr) {
            return { response: { message: 'Missing node_address field!'}, status: 401};
        }

        const data = { node_address: host };
        const headers = { 'Content-Type': 'application/json' };
        const client = new HTTPRequest(`http://${nodeAddr}:3000`)
        const response = await client.post(`/nodes/register`, data, { headers });


        if (response.status === 201) {
            const { chain, networkNodes } = response.data;
            const blockchain = await this.#core.createBlockchain();
            const peers = await this.#core.createPeers();
            blockchain.createChainFromDump(chain);
            peers.syncPeers([nodeAddr, ...networkNodes], host);
            return { response: { message: 'Registration successful'}, status: 200};
        } else {
            return { response: { message: 'Error registering node in network.'}, status: 500};
        }
    }

    async syncBlock(block: any) {
        const proof = block.hash;
        delete block.hash;

        const blockchain = await this.#core.createBlockchain();
        const added = blockchain.addBlock(block, proof!);

        if (!added) return { message: 'The block is discarded by the node.' , status: 500};

        return { message: 'Block added to the chain' , status:  201};
    }

    async #listPeers() {
        const peersInstance = await this.#core.createPeers();
        return await peersInstance.list();
    }   

}

interface newAddress {
    node_address: string
}       