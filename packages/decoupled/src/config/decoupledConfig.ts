import { resolve } from 'path';
import { get } from 'lodash';

let decoupledJson: object = null;

const DEFAULT_CONFIGS = {
    distDir: '.decoupled',
    srcDir: 'src',
};

function loadDecoupledConfig() {
    if (decoupledJson) {
        return {...DEFAULT_CONFIGS, ...decoupledJson};
    }

    try {
        decoupledJson = require(resolve('decoupled.config.js'));
    } catch (e) {
        decoupledJson = {};
    }

    return {...DEFAULT_CONFIGS, ...decoupledJson};
}

export const getFromDecoupledConfig = (keyPath: string, defaultValue: any = null): any => {
    return get(
        loadDecoupledConfig(),
        keyPath,
        defaultValue,
    );
};
