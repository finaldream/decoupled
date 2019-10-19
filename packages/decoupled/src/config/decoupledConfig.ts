import { resolve } from 'path';
import { get } from 'lodash';

let decoupledConfig: object = null;

const DEFAULT_CONFIG = {
    appPath: resolve('.decoupled'),
    srcDir: resolve('.'),
};

function loadDecoupledConfig() {

    if (!decoupledConfig) {
        try {
            decoupledConfig = require(resolve('decoupled.config'));
        } catch (e) {
            decoupledConfig = null;
        }
    }

    return { ...DEFAULT_CONFIG, ...decoupledConfig };
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
