/**
 * `serve`-command
 *
 * Serves a static site.
 */

import { Server } from '../server';
import { getDefaultEnv, prepareAction } from './utils';

/**
 * Implementation of the serve-command's action.
 * @param {Object} args
 * @param {Object} options
 */
export async function serveAction(args, options) {
    const opts = await prepareAction(args, options);
    const { env, host, port } = opts;
    const server = new Server(env);

    server.host = host || process.env.HOST || '127.0.0.1';
    server.port = port || process.env.PORT || 3000;
    server.bundleMode = 'build';

    server.init();
}

/**
 * Defintion of the `serve`-command
 *
 * @param {Caporal} app
 */
export function serveCommand(app) {
    app
        .command('serve', 'Serve a dynamic site')
        .argument('[env]', `Current environment`, null, getDefaultEnv())
        .option('--host <host>', 'host to server from. Defaults to env HOST or 127.0.0.1')
        .option('--port <port>', 'Port to server from. Defaults to env PORT or 3000')
        .action(serveAction);
}
