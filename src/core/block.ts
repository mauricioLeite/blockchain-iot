import crypto = require("crypto")
export class Block {
    index?: number
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
        this.transaction = _transaction
        this.previousHash = _previousHash
        this.createdAt = _created_at
        this.nonce = _nonce
        this.hash = _hash
    }

    computeHash(): string {
        const blockString: string = JSON.stringify(this)
        return crypto.createHash("sha256").update(blockString).digest("hex")
    }
}
