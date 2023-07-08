import axios, { AxiosResponse } from "axios";

export class HTTPRequest {
    protected baseURL;

    constructor(baseURL:string) {
        this.baseURL = baseURL;
    }

    async get(path: string, data?: any, config?: any) {
        return await this.#request('GET', path, data, config);
    }

    async post(path: string, data?: any, config?: any) {
        return await this.#request('POST', path, data, config);
    }

    async #request(method: string, path: string, data?: any, config?: any) {
        return await axios.request({
            baseURL: this.baseURL, 
            url: path,
            method: method,
            data,
            ...config
        });
    }
}

