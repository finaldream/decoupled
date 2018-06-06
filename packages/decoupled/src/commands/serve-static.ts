/**
 * `serve-static`-command
 *
 * Serves a static site.
 */

import path from 'path';
import { staticServer } from '../lib/static-server';
import { choices, getDefaultEnv } from './utils';

export function serveStaticAction(args, options, logger) {
    staticServer(path.join(process.env.PWD, 'public', args.site), undefined, undefined, logger.info);
}

export function serveStaticCommand(app) {
    app
        .command('serve-static', 'Serve static site')
        .argument('<site>', `Site to serve.`)
        .argument('[env]', `Current environment`, null, getDefaultEnv())
        .action(serveStaticAction);
}
