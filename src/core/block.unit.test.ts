import { Block } from "./block";

describe("Core Block", () => {

    describe("#init", () => {
        const transaction: object = { macAddress: "12:34:56:78:9A:BC" };
        const instance = new Block(0, transaction, "2b8b41f86c3d2a9e68fb5e4e79e7c3dc", new Date("2023-06-08T00:32:05.695Z"), 1234);

        it("should compute block hash", async () => {
            const expectedHash = "3c87819ddde6c5a624f99323a7716d63463871ab5970c3a477bb4bcdb518504e";
            const result:string = await instance.computeHash();
            
            expect(result).toEqual(expectedHash);
            expect(typeof result).toBe("string");
        })

    })
})
