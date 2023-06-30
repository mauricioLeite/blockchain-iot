import { createHash } from "crypto";

export class Block {
    id?: number
    index: number
    transaction: { [x: string]: any }
    previousHash: string
    createdAt?: Date | null
    nonce: number
    hash?: string | null

    constructor(
        _index: number,
        _transaction: { [x: string]: any },
        _previousHash: string,
        _created_at: Date | null = null,
        _nonce = 0,
        _hash: string | null = null
    ) {
        this.index = _index
        this.transaction = (typeof _transaction === "string") ? JSON.parse(_transaction) : _transaction;
        this.previousHash = _previousHash
        this.nonce = _nonce
        if (_created_at) this.createdAt = _created_at
        if (_hash) this.hash = _hash
    }

    computeHash(): string {
        const blockString: string = JSON.stringify(this)
        return createHash("sha256").update(blockString).digest("hex");
    }

    databaseFormat() {
        return Object.assign({ 
            index : this.index,
            transaction : JSON.stringify(this.transaction),
            previous_hash : this.previousHash,
            nonce : this.nonce,
            hash : this.hash,   
        }, this.createdAt ? {created_at: this.createdAt} : null);   
    }

    static createFromObject(reference: { [x: string]: any }) {
        return new Block(reference.index, reference.transaction, reference.previous_hash, reference.created_at, reference.nonce, reference.hash);
    }
}
