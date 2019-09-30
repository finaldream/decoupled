import { getDefaultEnv, prepareAction } from './utils';
import { DevServer } from '../server';

/**
 * Implementation of the serve-command's action.
 * @param {Object} args
 * @param {Object} options
 */
export async function watchAction(args, options) {
    const opts = await prepareAction(args, options);
    const { env, host, port } = opts;

    const siteHost = host || process.env.HOST || '127.0.0.1';
    const sitePort = port || process.env.PORT || 3000;

    const server = new DevServer(env, siteHost, sitePort);
    await server.setup();
}

/**
 * Defintion of the `serve`-command
 *
 * @param {Caporal} app
 */
export function watchCommand(app) {
    app
        .command('watch', 'Start server with watch mode')
        .argument('[env]', `Current environment`, null, getDefaultEnv())
        .option('--host <host>', 'host to server from. Defaults to env HOST or 127.0.0.1')
        .option('--port <port>', 'Port to server from. Defaults to env PORT or 3000')
        .action(watchAction);
}
