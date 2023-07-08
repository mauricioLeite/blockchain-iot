
export class Logger {
    #file: string;
    #module: string;

    constructor(file?:string, module?:string) {
        this.#file = file ?? "";
        this.#module = module ?? "";
    }

    info(log: any){
        log = this.#format('INFO', log);
        this.#register(log);
    }

    #format(level: string, log: any) {
        return {
            level,
            file: this.#file,
            module: this.#module,
            ...log
        };
    }

    #register(log: any) {
        const date = new Date(Date.now());
        log.date = date;
        console.log(log);
    }
}