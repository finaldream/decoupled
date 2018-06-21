/**
 * Generic Renderer
 */

import { get } from 'lodash';
import path from 'path';
import { ResponseData } from '../router/response-data';
import { Site } from '../site/site';
import { SiteDependent } from '../lib/common/site-dependent';

export type RenderEngineInterface = (site: Site, store: any) => string;

export class Renderer extends SiteDependent {

    private engine: RenderEngineInterface;

    constructor(site: Site, engine?: RenderEngineInterface) {

        super(site);

        const defaultEngine = this.site.config.get('render.engine');
        this.setEngine(engine || defaultEngine);
    }

    public setEngine(engine: RenderEngineInterface) {
        if (typeof engine !== 'function') {
            throw new Error(`Render engine must be a function!`);
        }

        this.engine = engine;
    }

    public render(store: ResponseData) {
        if (!this.engine || typeof this.engine !== 'function') {
            throw new Error('Please set a renderer engine in your site configuration');
        }

        return this.engine(this.site, store);

    }
}
