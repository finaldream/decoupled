import { Site, ServerRequest } from 'decoupled';
import { resolve } from 'path';

export const decoupledWordpressHandler = (site: Site, req: ServerRequest): Promise<AnyObject> => {
    return new Promise( () => true);
};
