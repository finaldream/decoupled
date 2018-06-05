import { ServerRequest } from '../server/server-request';
import { ServerResponse } from '../server/server-response';
import { Route } from './route';

export class ResponseData {

    public state: AnyObject = {};
    public route: Route | null = null;
    public request: ServerRequest | null = null;
    public response: ServerResponse | null = null;

}
