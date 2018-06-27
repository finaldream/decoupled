/**
 * Delayed Queue.
 * Push-Queue, where the first push in each cycle will start a timeout after which a callback is triggered.
 * This allows for throttled and delayed processing of timely distribute collections.
 * I.e. Invalidation-triggers can be collected that way and run just once.
 */

import { logger } from '../logger';

export class DelayedQueue {

    private invalidates: any;
    private timeout: number;
    private callback: any;
    private items: any[];
    private timeoutId: any;

    constructor(invalidates: any, timeout, callback) {

        this.invalidates = invalidates;
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

        logger.info(`DelayedQueue.push ${this.items.length} items are queued`);

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
        logger.info(`DelayQueue triggered with ${this.items.length} items`);

        const items = this.items.slice();
        this.reset();
        this.callback(this.invalidates, items);
    }
}

