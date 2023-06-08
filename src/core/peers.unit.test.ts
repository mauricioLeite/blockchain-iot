import { Peers } from "./peers";
import { DatabaseResourceFactory } from "@database";

describe("Core Peers", () => {

    describe("#init", () => {
        const instance = new Peers( new DatabaseResourceFactory());

        it("should list all peers", async () => {
            const result = await instance.list();
            expect(result).toBeInstanceOf(Object);
        })

        it("should sync outside peers", async () => {
            const peers:string[] = ['1.2.3.4', '5.6.7.8'];
            const result = await instance.syncPeers(peers, '0.0.0.0');
            expect(result).toEqual(true);
        })

    })
})
