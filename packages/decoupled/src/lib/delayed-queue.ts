/**
 * Delayed Queue.
 * Push-Queue, where the first push in each cycle will start a timeout after which a callback is triggered.
 * This allows for throttled and delayed processing of timely distribute collections.
 * I.e. Invalidation-triggers can be collected that way and run just once.
 */

import { Logger } from '../logger';
import { SiteDependent } from './common/site-dependent';
import { Site } from '../site/site';

export class DelayedQueue extends SiteDependent {

    public readonly site: Site;
    public readonly logger: Logger;
    private  timeout: number;
    private callback: any;
    private items: any[];
    private timeoutId: any;

    constructor(site: Site, timeout, callback) {
        super(site);

        this.site = site;
        this.timeout = timeout;
        this.callback = callback;
        this.items = [];
        this.timeoutId = null;

        this.trigger = this.trigger.bind(this);

    }

    /**
     * Pushes new items and starts a new timeout-cycle
     * @param {Array|*} items
     */
    public push(items: any[] | any) {

        const arrayItems = Array.isArray(items)
            ? items
            : [items];

        this.items.push(...arrayItems);

        this.logger.info(`DelayedQueue.push ${this.items.length} items are queued`);

        if (this.timeoutId) {
            return;
        }

        this.timeoutId = setTimeout(this.trigger, this.timeout);

    }

    public reset() {
        this.timeoutId = null;
        this.items = [];
    }

    public trigger() {
        this.logger.info(`DelayQueue triggered with ${this.items.length} items`);

        const items = this.items.slice();
        this.reset();
        this.callback(this.site, items);
    }
}

