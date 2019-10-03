import { Site, ServerRequest } from 'decoupled';
import { loadJsonDocument } from './load-json-document';
import { resolve } from 'path';

export const decoupledMarkdownHandler = (site: Site, req: ServerRequest): Promise<AnyObject> => {

    const dir = resolve(
        site.directory,
        site.config.get('services.jsonData.docDir', 'content')
    );

    return loadJsonDocument(req.path, dir);

};
