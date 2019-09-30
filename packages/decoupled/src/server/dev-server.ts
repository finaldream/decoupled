import http from 'http';
import reload from 'reload';
import webpack from 'webpack';
import { Server } from './server';
import { getWebpackConfigs } from '../webpack';
import {logger} from '../logger';

export class DevServer extends Server {

    protected server: http.Server;

    constructor(public environment: string, public host: string, public port: number) {
        super(environment);

        this.server = http.createServer(this.app);
    }

    public async setup() {
        super.init();
        const backendConfig = getWebpackConfigs(this);
        const frontendConfig = getWebpackConfigs(this, 'web');

        webpack(frontendConfig, (error, stats) => {
            if (error) {
                console.error(error);
            }
        });

        webpack(backendConfig, (error, stats) => {
            if (error) {
                console.error(error);
            }
        });
    }
}

