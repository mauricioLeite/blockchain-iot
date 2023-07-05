import { DatabaseResourceFactory } from "@database";
import { Blockchain } from "./blockchain";

import { Devices as DevicesResource} from "@database/entities/devices.entity";
import { Block } from "./block";
import { generateRandomMacAddress } from "@utils/generate";

describe("Core Blockchain", () => {

    describe("#init", () => {
        const instance = new Blockchain(new DatabaseResourceFactory());
        let lastBlock: Block;

        it("should initialize blockchain", async () => {
            const result = await instance.init();
            expect(result).toBe(true);
        })

        it("should list chain", async () => {
            const result = await instance.chain();
            expect(result).toBeInstanceOf(Object);
        })

        it("should return last chain block", async () => {
            const result = await instance.lastBlock();
            lastBlock = result;
            expect(result).toBeInstanceOf(DevicesResource);
        })

        it("should return specific chain block", async () => {
            const result = await instance.getBlock(0);
            expect(result).toBeInstanceOf(DevicesResource);
        })

        it("should mine new block", async () => {
            const transaction: object = { macAddress:  generateRandomMacAddress()};
            const result = await instance.mine({ transaction });
            expect(typeof result).toBe('number');
        })


        // !TEST WITH VALID BLOCK GENERATED ON BLOCKCHAIN
        // it("should return block proof validation", async () => {
        //     const blockTest = new Block( 0, {data: "test"}, 'k20skc=d120k1+e');
        //     blockTest.nonce = 5;
        //     const blockHash = 'jo2mfdm0d,d-d=d3';
        //     const result = await instance.isValidProof(blockTest, blockHash);
        //     console.log(result);
        //     expect(result).toBe(true);
        // })

        // !MINE TEST BEFORE TO GENERATE VALID BLOCK 
        // it("should add a block to chain", async () => {
        //     const blockTest = new Block( 0, [], "0", new Date(" 2023-06-28T23:32:55.321Z"), 525);
        //     const blockHash = '000658a8c8212f1574135b248734d0deb80914ffe76507c45b31c45851f8c93c';
        //     const result = await instance.addBlock(blockTest, blockHash);
        //     expect(typeof result).toBe('number');
        // })

        it("should compute proof for desired block", async () => {
            const blockTest = new Block( 0, {data: "test"}, lastBlock.hash!);
            const result = instance.proofOfWork(blockTest);
            expect(typeof result).toBe('string');
        })

        // ! FINISH DUMP METHOD TEST --- NEED TO UPDATE ALL HASH ON TESTS
        it("should create chain from dump", async () => {
            const chain = getChainDump();
            const result = await instance.createChainFromDump(chain);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(chain.length);
        })

        it("should check chain validity", async () => {
            const chain = getChainDump();
            const result = await instance.checkChainValidity(chain);
            expect(result).toBe(true);
        })
        

    })
})

function getChainDump() {
    return [
        {
          id: 1,
          index: 0,
          transaction: '[]',
          created_at: '2023-06-30T00:03:11.285Z',
          previous_hash: '0',
          nonce: 4,
          hash: '008de7471dd29e23a9ded982e5dcc987c1d4b267bb5286b4eca29d25dfc06c92'
        },
        {
          id: 2,
          index: 1,
          transaction: '{"macAddress":"12:C0:25:4A:C6:38"}',
          created_at: '2023-06-30T00:03:11.000Z',
          previous_hash: '008de7471dd29e23a9ded982e5dcc987c1d4b267bb5286b4eca29d25dfc06c92',
          nonce: 259,
          hash: '000c2cb76ecf7860cfbb66bb0b39fac398805ebefd365f6f392243e4a5392c6f'
        },
        {
          id: 3,
          index: 2,
          transaction: '{"macAddress":"E0:F3:F9:15:D5:34"}',
          created_at: '2023-06-30T00:03:18.000Z',
          previous_hash: '000c2cb76ecf7860cfbb66bb0b39fac398805ebefd365f6f392243e4a5392c6f',
          nonce: 104,
          hash: '00c18f80e783b3fdab2078b4588f772f0d2dceb8ce3ea5cc0bae04be453311ce'
        },
        {
          id: 4,
          index: 3,
          transaction: '{"macAddress":"4D:24:3E:48:4E:05"}',
          created_at: '2023-06-30T00:03:37.000Z',
          previous_hash: '00c18f80e783b3fdab2078b4588f772f0d2dceb8ce3ea5cc0bae04be453311ce',
          nonce: 49,
          hash: '00e4abeb7124fbdb0360acf847cedd6545197fe2f195595953e3442e795cad2a'
        }
      ]
}
