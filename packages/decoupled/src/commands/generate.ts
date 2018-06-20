/**
 * Generate-command
 *
 * generates a static site.
 */

import { Generator } from '../generator';
import { choices, getDefaultEnv, prepareAction } from './utils';

/**
 * Runs the generator
 *
 * @returns Promise
 */
export function generateAction(args, options) {
    // TODO: REACTIVATE
    const opts: any = {}; // prepareAction(args, options);

    // opts = Object.assign({}, opts, config.get('generator'));

    const generator = new Generator(opts.site, opts);
    return generator.run();
}

export function generateCommand(app) {
    app
        .command('generate', 'Generate static site')
        .argument('<site>', `Site to generate.`)
        .argument('[env]', `Current environment`, null, getDefaultEnv())
        .action(generateAction);
}
