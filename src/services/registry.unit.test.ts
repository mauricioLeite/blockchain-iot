import { Registry  } from "./registry";
import { DatabaseResourceFactory } from "@database";

describe("Registry Service", () => {

    describe("#init", () => {
        const instance: Registry = new Registry(new DatabaseResourceFactory());
        

        it("should list the registry state", async () => {
            const result = await instance.list();
            expect(result).toHaveProperty('status');
            expect(result.status).toBe(200);
            expect(result).toHaveProperty('chain');
            expect(result).toHaveProperty('peers');
        })

    })
})
