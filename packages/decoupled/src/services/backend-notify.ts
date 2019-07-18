/**
 * Backend Notify
 */

import { SiteDependent } from '../lib/common/site-dependent';
import { Site } from '../site/site';
import fetch from 'node-fetch';

export class BackendNotify extends SiteDependent {

    /**
     * BackendNotify constructor
     */

    private notifyEndpoint: string;

    constructor(site: Site, notifyPath?: string) {

        super(site);
        if (!notifyPath) {
            this.logger.warn('[BACKEND NOTIFY] No endpoint path provided! Errors probably ahead');
        }
        this.notifyEndpoint = `${site.config.get('services.wpapi.endpoint')}${notifyPath}`;
        this.logger.debug('[BACKEND NOTIFY] intialized with endpoint:', this.notifyEndpoint);

    }

    public sendNotification(message: string|object, senderTags?: string[]) {
        const body = this.prepareMessage(message, senderTags);
        this.postMessage(body).then(() => {
                this.logger.info('[BACKEND NOTIFY] message succesfully sent:', message);
                this.logger.debug('[BACKEND NOTIFY] ...with the following tags:', senderTags);
                return true;
            }).catch( (err) => {
                this.logger.error('[BACKEND NOTIFY] Could not send message:', message, err.message);
                return false;
            }
        );
    }

    private prepareMessage(content: string|object, senderTags?: string[]) {
        const message = {
            date: new Date().toISOString(),
            tags: [...senderTags],
            payload: content,
        };
        return JSON.stringify(message);
    }

    private async postMessage(body: string) {
        const headers = {'Content-Type': 'application/json'};
        const authentication = this.site.config.get('services.wpapi.authentication');
        if (authentication) {
            if (authentication.username && authentication.password) {
                const encoded = new Buffer(`${authentication.username}:${authentication.password}`).toString('base64');
                Object.assign(headers, { Authorization: `Basic ${encoded}` });
            }
            if (authentication.token) {
                Object.assign(headers, { 'decoupled-token': authentication.token });
            }
        }
        const res = await fetch(this.notifyEndpoint, {
            method: 'post',
            body,
            headers
        });
        if (!res.ok) {
            throw new Error(res.status);
        }
        return res;
    }
}
