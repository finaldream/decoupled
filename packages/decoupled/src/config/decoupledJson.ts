import { join } from 'path';
import { get } from 'lodash';

let decoupledJson: object = null;

function loadDecoupledJson() {

    if (decoupledJson) {
        return decoupledJson;
    }

    try {
        decoupledJson = require(join(process.env.PWD, 'decoupled.json'));
    } catch (e) {
        decoupledJson = null;
    }

    return decoupledJson || {};

}

export const hasDecoupledJson = (): boolean => {

    loadDecoupledJson();
    return decoupledJson !== null;

};

export const getFromDecoupledJson = (keyPath: string, defaultValue: any = null): any => {

    return get(
        loadDecoupledJson(),
        keyPath,
        defaultValue,
    );

};
