import { resolve } from 'path';
import { get } from 'lodash';

let decoupledConfig: object = null;

const DEFAULT_CONFIGS = {
    distDir: '.decoupled',
    srcDir: 'src',
};

function loadDecoupledConfig() {
    if (decoupledConfig) {
        return {...DEFAULT_CONFIGS, ...decoupledConfig};
    }

    try {
        decoupledConfig = require(resolve('decoupled.config.js'));
    } catch (e) {
        decoupledConfig = null;
    }

    return {...DEFAULT_CONFIGS, ...decoupledConfig};
}

export const hasDecoupledConfig = (): boolean => {
    loadDecoupledConfig();
    return decoupledConfig !== null;
};

export const getFromDecoupledConfig = (keyPath: string, defaultValue: any = null): any => {
    return get(
        loadDecoupledConfig(),
        keyPath,
        defaultValue,
    );
};
