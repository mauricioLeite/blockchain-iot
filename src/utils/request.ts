import axios from "axios";

export class HTTPRequest {
    protected _baseURL;

    constructor(baseURL:string) {
        this._baseURL = baseURL;
    }
    
    set baseURL(value: string) { this._baseURL = value; }

    async get(path: string, data?: any, config?: any) {
        return await this.#request('GET', path, data, config);
    }

    async post(path: string, data?: any, config?: any) {
        return await this.#request('POST', path, data, config);
    }

    async #request(method: string, path: string, data?: any, config?: any) {
        return await axios.request({
            baseURL: this._baseURL, 
            url: path,
            method: method,
            data,
            ...config
        });
    }
}

