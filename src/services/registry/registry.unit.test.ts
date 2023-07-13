import { Registry } from "./registry.service";
import { DatabaseResourceFactory } from "@database";
import { CoreFactory } from "@core";

describe("Registry Service", () => {

    describe("#init", () => {
        const storage = new DatabaseResourceFactory();
        const instance: Registry = new Registry(storage, new CoreFactory(storage));
        

        it("should list the registry state", async () => {
            const { response , status } = await instance.list();
            expect(status).toBe(200);
            expect(response).toHaveProperty('chain');
            expect(response).toHaveProperty('peers');
        })

        it("should list the registry state", async () => {
            const result = await instance.clearLocal();
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(200);
        })

    })
})
