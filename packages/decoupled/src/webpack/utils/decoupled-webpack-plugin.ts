import { logger } from '../../logger';
import { isHash } from './hash';
import Chalk from 'chalk';

export class DecoupledWebpackPlugin {

    static Plugin: string = 'DecoupledWebpackPlugin';

    apply(compiler) {

        compiler.hooks.compilation.tap(DecoupledWebpackPlugin.Plugin, (compilation) => {

            logger.debug(Chalk.green(`Starting Compilation`));
            logger.silly(() => [
                'Compilation triggered by',
                Object.keys((compiler as any).watchFileSystem.watcher.mtimes)
            ]);

            compilation.hooks.afterHash.tap(DecoupledWebpackPlugin.Plugin, () => {

                if (isHash(compilation.hash)) {
                    return;
                }

                logger.info(Chalk.yellow(`Compiling ${compilation.hash}`));

            });
        });

        compiler.hooks.assetEmitted.tap(DecoupledWebpackPlugin.Plugin, (file) => {
            logger.debug(Chalk.yellow(`Emitted ${file}`))
        });
    }
}
