import vhost from 'vhost';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { Server } from './server';
import { getSiteIDs } from '../config';
import { appPath, getWebpackConfigs } from '../lib';


export class DevServer extends Server {

    public init() {
        const webpackConfig = getWebpackConfigs();
        const compiler = webpack(webpackConfig);

        this.app.use(webpackDevMiddleware(compiler, {
            logLevel: 'warn'
        }));

        /*this.app.use(webpackHotMiddleware(compiler, {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000
        }));*/

        webpack(webpackConfig, (error, stats) => {
            if (error) {
                console.log(error);
            }

            super.init();
        });
    }
}

