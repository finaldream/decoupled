import { join } from 'path';
import { getFromDecoupledConfig } from '../config';

let basePath: string;

export const appPath = (path: string | string[] = ['']) => {

    const paths = (Array.isArray(path)) ? path : [path];

    if (!basePath) {
        basePath = getFromDecoupledConfig('distDir');
    }

    return join(basePath, ...paths);

};
