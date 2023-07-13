import { Block } from "./block";

describe("Core Block", () => {

    describe("#init", () => {
        const transaction: object = { uuid: "e270a4a8-c4f3-4373-a7e5-109eb8e723e2" };
        const instance = new Block(0, transaction, "2b8b41f86c3d2a9e68fb5e4e79e7c3dc", new Date("2023-06-08T00:32:05.695Z"));

        it("should compute block hash", async () => {
            const expectedHash = "ea0ff49d110249a1ef91df1797e4dba782b0aacbda8b501130a8ebe050ff1a5d";
            const result:string = await instance.computeHash();
            
            expect(result).toEqual(expectedHash);
            expect(typeof result).toBe("string");
        })

    })
})
