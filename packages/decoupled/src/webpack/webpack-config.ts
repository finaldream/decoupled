import glob from 'glob';
import { resolve, relative, join } from 'path';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

import nodeExternals from 'webpack-node-externals';

import { RestartServerPlugin } from './restart-server-plugin';
import { getFromDecoupledConfig } from '../config';
import { appPath } from '../lib';
import { DevServer } from '../server';


const DEFAULT_WEBPACK_CONFIG = {
    mode: 'development',
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ]
    },
    externals: [nodeExternals()],
    plugins: [],
};

const getWebpackEntries = () => {
    const entries = {};
    const srcDir = resolve(getFromDecoupledConfig('srcDir'));
    const files = glob.sync(join(srcDir, '**/*.js'));

    files.forEach((path) => {
        const relativePath = relative(srcDir, path);
        entries[relativePath] = [path];
    });

    return entries;
};

const getBackendConfig = (server: DevServer, target: string = 'node', watch: boolean = true) => {
    const entries = getWebpackEntries();

    const plugins = DEFAULT_WEBPACK_CONFIG.plugins || [];

    if (target === 'node') {
        plugins.push(new CleanWebpackPlugin());
        plugins.push(new RestartServerPlugin(server));
    }

    return {
        ...DEFAULT_WEBPACK_CONFIG,
        entry: entries,
        context: resolve(getFromDecoupledConfig('srcDir')),
        output: {
            path: resolve(appPath('')),
            filename: '[name]',
            libraryTarget: 'commonjs2',
        },
        target,
    };
};

const getFrontendConfig = (server: DevServer, target: string = 'web', watch: boolean = true) => {
    const configs = require(resolve('./webpack.config.js'));

    return {
        ...configs,
        watch,
        target,
    };
};

export const getWebpackConfigs = (server: DevServer, target: string = 'node', watch: boolean = true) => {
    return (target === 'node') ? getBackendConfig(server, target, watch) : getFrontendConfig(server, target, watch);
};
