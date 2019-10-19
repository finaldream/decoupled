import { join } from 'path';
import { getFromDecoupledConfig } from '../config';

let basePath: string;

export const appPath = (path: string = '') => {

    if (!basePath) {
        basePath = getFromDecoupledConfig('appPath');
    }
    return join(basePath, path);

};
