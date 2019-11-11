import { getServerSideConfig } from '.';
import webpack = require('webpack');
import { logger } from '../logger';
import Chalk from 'chalk';
import { BundleFileInfo } from '../bundles';
import { join } from 'path';
import { getFromDecoupledConfig } from '../config';
import { isHash, setHash } from './utils/hash';
import { DecoupledWebpackPlugin } from './utils/decoupled-webpack-plugin';


export const compile = (callback, watch: boolean) => {

    const config = getServerSideConfig(watch)
    const compiler = webpack(config);

    logger.silly(() => ['Webpack Config', config])

    new DecoupledWebpackPlugin().apply(compiler);

    const compilerHandler = (error, stats: webpack.Stats) => {
        if (error) {
            console.error(error);
        } else {

            if (isHash(stats.hash)) {
                logger.debug(`Compilation hash unchanged, skipping reload`)
                return;
            }

            setHash(stats.hash);

            logger.info(Chalk.green(`Compilation finsished, took ${stats.endTime - stats.startTime}ms (hash: ${stats.hash})`))

            if (stats.hasWarnings()) {
                stats.compilation.warnings.forEach(warning => logger.warn(warning))
            }

            if (stats.hasErrors()) {
                stats.compilation.errors.forEach(error => logger.warn(error))
            }

            const bundles: BundleFileInfo[] = [];

            stats.compilation.chunks.forEach(({ id, files }) => {
                bundles.push({
                    id,
                    file: files.find(i => /\.js$/.test(i))
                })
            })

            callback(bundles, stats);
        }
    }

    if (watch) {
        const watchOptions = {
            ignored: [join(getFromDecoupledConfig('appPath'), 'entries', '*.*')],
        };
        compiler.watch(watchOptions, compilerHandler);
    } else {
        compiler.run(compilerHandler);
    }

}
