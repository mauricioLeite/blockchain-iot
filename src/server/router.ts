import { Router } from "express";
import { Request, Response } from "express";
import { MineController, NodesController, RegistryController, TransactionsController,  } from "@services";

const router: Router = Router();

const mine = new MineController();
const nodes = new NodesController();
const registry = new RegistryController();
const transactions = new TransactionsController();

router.get("/", function (_req: Request, res: Response) {
    return res.json({
        response: 'Hello World'
    });
});

//  Mine Service routes
router.post("/mine", mine.post);

//  Nodes Service routes
router.post("/nodes/register", nodes.post_register);
router.post("/nodes/join", nodes.post_join);

//  Registry Service routes
router.get("/registry", registry.get);
router.delete("/registry", registry.delete);

//  Transactions Service routes
router.get("/transactions", transactions.get);
router.post("/transactions", transactions.post);

export { router };
