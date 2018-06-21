import { Site } from '../../site/site';

export class SiteDependent {

    public readonly site: Site;
    constructor(site: Site) {

        this.site = site;
    }

}
