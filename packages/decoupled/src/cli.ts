/**
 * Main dcoupled-cli
 *
 * Used by ./bin/dcoupled, can also be invoked directly, if required
 */

import dotenv from 'dotenv';
import caporal from 'caporal';
import { join } from 'path';
import { serveCommand, serveStaticCommand, generateCommand } from './commands';
import packageJson from '../package.json';
import { getDecoupledJson } from './commands/utils';
import { provider } from 'multisite-config';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.log(err, err.stack);
});

const app = caporal.version(packageJson.version);

const dcJson = getDecoupledJson();

if (!dcJson) {
    throw new Error('No "decoupled.json" found in current directory.');
}

provider.setConfigPath(join(dcJson.appPath || '', './config'));

// Register commands
generateCommand(app);
serveCommand(app);
serveStaticCommand(app);

app.parse(process.argv);
