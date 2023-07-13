import { DatabaseResourceFactory } from "@database";
import { Blockchain } from "./blockchain";

import { Devices as DevicesResource} from "@database/entities/devices.entity";
import { Block } from "./block";

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
            const transaction_data: object = { uuid: 'e270a4a8-c4f3-4373-a7e5-109eb8e723e2'};
            const result = await instance.mine({ transaction_data });
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
			id: 17,
			index: 0,
			uuid: "146e3e34-5584-451a-b416-88d7c45cdd40",
			transaction: "[]",
			created_at: "2023-07-09T21:49:33.365Z",
			previous_hash: "0",
			nonce: 119,
			hash: "002700d2797b6640e118d9ce96617d0879d6ef138450feba36373d96dea8d5c3"
		},
		{
			id: 18,
			index: 1,
			uuid: "016f0181-57a7-4ae3-8f9e-0a7a034d5b57",
			transaction: "{\"uuid\":\"016f0181-57a7-4ae3-8f9e-0a7a034d5b57\"}",
			created_at: "2023-07-09T21:56:21.000Z",
			previous_hash: "002700d2797b6640e118d9ce96617d0879d6ef138450feba36373d96dea8d5c3",
			nonce: 230,
			hash: "009fa4037697bad4456980f6bf29582bb7773269c1c6616fcdcabcaf09435576"
		},
		{
			id: 19,
			index: 2,
			uuid: "f62e61a6-2dd7-45ff-8853-14d9f6ee1630",
			transaction: "{\"uuid\":\"f62e61a6-2dd7-45ff-8853-14d9f6ee1630\"}",
			created_at: "2023-07-09T21:56:22.000Z",
			previous_hash: "009fa4037697bad4456980f6bf29582bb7773269c1c6616fcdcabcaf09435576",
			nonce: 334,
			hash: "0076b56279ef65adff3622cd9a904e7c5b526907f2f80363194c43dbdd60d749"
		},
		{
			id: 20,
			index: 3,
			uuid: "e270a4a8-c4f3-4373-a7e5-109eb8e723e2",
			transaction: "{\"uuid\":\"e270a4a8-c4f3-4373-a7e5-109eb8e723e2\"}",
			created_at: "2023-07-09T21:56:23.000Z",
			previous_hash: "0076b56279ef65adff3622cd9a904e7c5b526907f2f80363194c43dbdd60d749",
			nonce: 506,
			hash: "00be9387dbf894f97f2bfb7d499a7bf4fb491bdc2fdaa284b1da8b2173aea8d5"
		}
	]
}
