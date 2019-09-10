import webpack from 'webpack';
import { Server } from './server';
import { getWebpackConfigs } from '../webpack';

export class DevServer extends Server {

    public init() {
        const webpackConfig = getWebpackConfigs();
        const compiler = webpack(webpackConfig);

        webpack(webpackConfig, (error, stats) => {
            if (error) {
                console.log(error);
            }

            super.init();
        });
    }
}

