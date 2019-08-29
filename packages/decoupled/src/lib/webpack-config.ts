import webpack from 'webpack';
import 'webpack-hot-middleware';
import glob from 'glob';
import { resolve, relative, join } from 'path';

import {getFromDecoupledConfig} from '../config';
import { appPath } from './app-path';

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

const DEFAULT_WEBPACK_CONFIG = {
    mode: 'development',
    context: null,
    entry: {},
    output: null,
    target: 'node',
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
};

const getWebpackEntries = () => {
    const entries = {};
    const srcDir = resolve(getFromDecoupledConfig('srcDir'));
    const files = glob.sync(join(srcDir, '**/*.js'));

    files.forEach((path) => {
        const relativePath = relative(srcDir, path);
        // entries[relativePath] = [path, hotMiddlewareScript];
        entries[relativePath] = [path];
    });

    return entries;
};

export const getWebpackConfigs = () => {
    const entries = getWebpackEntries();

    return {
        ...DEFAULT_WEBPACK_CONFIG,
        entry: entries,
        context: resolve(getFromDecoupledConfig('srcDir')),
        output: {
            path: resolve(appPath('', 'development')),
            filename: '[name]',
            libraryTarget: 'commonjs2',
        }
    };
};
