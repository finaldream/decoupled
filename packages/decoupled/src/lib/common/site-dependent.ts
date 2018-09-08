import { Site } from '../../site/site';
import { Logger } from 'decoupled-logger';

export class SiteDependent {

    public readonly site: Site;
    public readonly logger: Logger;
    constructor(site: Site) {

        this.site = site;
        this.logger = site.logger;
    }

}
