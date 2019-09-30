import { logger } from '../logger';

export class RestartServerPlugin {

    constructor(protected readonly server) {}

    public apply(compiler) {
        const plugin = {name: 'StartServerPlugin'};

        compiler.hooks.afterEmit.tapAsync(plugin, this.afterEmit);
    }

    public afterEmit = (compilation, callback) => {

        this.server.server.close(() => {
            logger.log('info', `Starting development server`);

            const { host, port } = this.server;

            this.server.server.listen(port, host, () => {
                logger.log('info', `Development server listening on http://${host}:${port}`);

                const maybePort = port !== 80 ? `:${port}` : '';

                for (const site of this.server.sites) {
                    logger.log('info', `${site.id} on http://${site.host}${maybePort}`);
                }

                return callback();
            });
        });
    }
}
