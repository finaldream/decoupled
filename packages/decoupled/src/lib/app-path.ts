import { join } from 'path';
import { getFromDecoupledConfig } from '../config';

let basePath: string;

export const appPath = (path: string | string[] = [''], environment?: string) => {

    const paths = (Array.isArray(path)) ? path : [path];
    const env = environment || process.env.NODE_ENV || 'development';

    if (!basePath) {
        basePath = getFromDecoupledConfig('distDir');
    }

    return join(basePath, ...paths);

};
