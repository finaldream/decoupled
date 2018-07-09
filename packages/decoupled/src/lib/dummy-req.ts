/**
 * Creates a dummy request object, that can be used for mocking tests or running the static site generator.
 */

import { parse } from 'url';

class DummyRequest {

    public protocol: string;
    public hostname: string;
    public url: string;
    public port: string;
    public path: string;
    public query: string;
    public hash: string;
    public headers: object = {};
    public connection: object = {};

    constructor(requestUrl: string) {

        const {
            host: hostname,
            protocol,
            port,
            path: url,
            pathname: path,
            search: query,
            hash,
        } = parse(requestUrl);

        this.protocol = String(protocol || '').replace(/:/, '');
        this.hostname = hostname;
        this.url = url;
        this.port = port;
        this.path = path;
        this.query = query;
        this.hash = hash;
    }

    public get(key: string) {
        const lowerKey = key.toLowerCase();
        const result = this.headers[lowerKey];

        if (result) {
            return result;
        }

        switch (lowerKey) {
            case 'host': return this.hostname;
            default: return undefined;
        }
    }

}

export const dummyReq = (requestUrl) => new DummyRequest(requestUrl);
