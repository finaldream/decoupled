import glob from 'glob';
import { resolve, relative, join } from 'path';

import nodeExternals from 'webpack-node-externals';

import { RestartServerPlugin } from './restart-server-plugin';
import { getFromDecoupledConfig } from '../config';
import { appPath } from '../lib';


const DEFAULT_WEBPACK_CONFIG = {
    mode: 'development',
    devtool: '#source-map',
    module: {
        rules : [
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

export const getWebpackConfigs = (target = 'node', watch = true) => {
    const entries = getWebpackEntries();

    const plugins = DEFAULT_WEBPACK_CONFIG.plugins || [];

    if (target === 'node') {
        plugins.push(new RestartServerPlugin({}));
    }

    return {
        ...DEFAULT_WEBPACK_CONFIG,
        entry: entries,
        context: resolve(getFromDecoupledConfig('srcDir')),
        output: {
            path: resolve(appPath('', 'development')),
            filename: '[name]',
            libraryTarget: 'commonjs2',
        },
        watch,
        target,
    };
};
