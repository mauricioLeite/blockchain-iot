import express, { NextFunction } from "express";
import morgan from "morgan";

import { router } from "./router";

export class Server {
    #server: express.Application;

    constructor() {
        this.#server = express();
        this.#server.use(morgan('dev'));
        this.#middleware();
        this.#router();
        this.#notFound();
        this.#errorHandling();
    }

    #middleware() {
        this.#server.use(express.json());
    }

    #router() {
        this.#server.use(router);
    }

    #notFound() {
        this.#server.use( function(_req:any, _res: any, next: NextFunction) {
            const error = new HTTPError("Not found");
            error.status = 404;
            next();

        });
    }

    #errorHandling() {
        this.#server.use( function(err: any, _req: any, res:any, next: NextFunction) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });
    }

    listen() {
        const port = process.env.PORT || 3000;
        this.#server.listen(port, () => {
            console.log(`Listening on PORT ${port}...`);
        });
    }

}   

class HTTPError extends Error {
    status: number
}