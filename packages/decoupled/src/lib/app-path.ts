import { join } from 'path';
import { getFromDecoupledJson } from '../config';

let basePath: string;

export const appPath = (path: string = '') => {

    if (!basePath) {
        basePath = getFromDecoupledJson('appPath', './');
    }
    return join(basePath, path);

};
