import axios from "axios";

export class HTTPRequest {
    protected _baseURL;

    constructor(baseURL:string) {
        this._baseURL = this.#getFormattedURL(baseURL);
    }
    
    set baseURL(value: string) { this._baseURL = this.#getFormattedURL(value); }

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

    #getFormattedURL(url: string) {
        return (process.env.ENV === "dev") ? `${url}:3000` : url;
    }
}

