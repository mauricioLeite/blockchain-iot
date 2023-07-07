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

router.get("/transactions", transactions.get);

export { router };
