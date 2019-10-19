import http from 'http';
import webpack from 'webpack';
import { Server } from './server';
import { getWebpackConfigs } from '../webpack';

const BackendWatchOptions = {};

export class DevServer extends Server {

    protected server: http.Server;

    constructor(public environment: string, public host: string, public port: number) {
        super(environment);

        this.server = http.createServer(this.app);
    }

    public async setup() {

        const backendConfig = getWebpackConfigs(this);
        // const frontendConfig = getWebpackConfigs(this, 'web');

        // webpack(frontendConfig, (error, stats) => {
        //     if (error) {
        //         console.error(error);
        //     }
        // });

        const backend = webpack(backendConfig);

        backend.watch(
            BackendWatchOptions,
            (error, stats) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(stats);
                    super.init();
                }
            });
    }
}

