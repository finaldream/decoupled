import { resolve } from 'path';
import nodeExternals from 'webpack-node-externals';

import { getFromDecoupledConfig, getSiteIDs } from '../config';
import { appPath } from '../lib';
import { cacheEntryTemplate, makeSiteEntry } from './utils';
import webpack = require('webpack');

cacheEntryTemplate(resolve(__dirname, '..', '..', 'misc', 'entry.ejs.js'))

const DEFAULT_WEBPACK_CONFIG = {
    devtool: '#source-map' as webpack.Options.Devtool,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ]
    },
    plugins: [],
};

const getWebpackEntries = () => {
    const entries = {};
    const sites = getSiteIDs(resolve(getFromDecoupledConfig('srcDir'), 'sites'), true);

    sites.forEach(siteId => entries[siteId] = makeSiteEntry(siteId));

    return entries;
};

const getMode = () => process.env.NODE_ENV === 'production' ? 'production' : 'development'

export const getServerSideConfig = (watch: boolean): webpack.Configuration => {
    return {
        ...DEFAULT_WEBPACK_CONFIG,
        mode: getMode(),
        entry: getWebpackEntries(),
        context: resolve(getFromDecoupledConfig('srcDir')),
        output: {
            path: resolve(appPath('')),
            filename: watch ? '[name]-[hash].js' : '[name].js',
            libraryTarget: 'commonjs2',
        },
        target: 'node',
        externals: [nodeExternals()],
    };
};
