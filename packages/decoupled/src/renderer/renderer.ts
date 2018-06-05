/**
 * Generic Renderer
 */

import { get } from 'lodash';
import { config } from 'multisite-config';
import path from 'path';
import { ResponseData } from '../router/response-data';

type RenderEngine = (store: any) => string;

export class Renderer {

    private engine: RenderEngine;

    constructor(engine?: RenderEngine) {
        const defaultEngine = config.get('render.engine');
        this.setEngine(engine || defaultEngine);
    }

    public setEngine(engine: RenderEngine) {
        if (typeof engine !== 'function') {
            throw new Error(`Render engine must be a function!`);
        }

        this.engine = engine;
    }

    public render(store: ResponseData) {
        if (!this.engine || typeof this.engine !== 'function') {
            throw new Error('Please set a renderer engine in your site configuration');
        }

        return this.engine(store);

    }
}
