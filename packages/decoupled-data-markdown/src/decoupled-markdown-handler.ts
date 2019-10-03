import { Site, ServerRequest } from 'decoupled';
import { MarkdownMetaResult } from './markdown-meta-result';
import { loadMarkdownDocument } from '.';
import { resolve } from 'path';

export const decoupledMarkdownHandler = (site: Site, req: ServerRequest): Promise<MarkdownMetaResult> => {

    const dir = resolve(
        site.directory,
        site.config.get('services.markdownData.docDir', 'content')
    );

    // TODO: customize showdown and YAML-options via Site.config.
    return loadMarkdownDocument(req.path, dir);

};
