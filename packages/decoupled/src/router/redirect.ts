/**
 * Redirect Class
 */

import { isFunction, isRegExp } from 'lodash';
import minimatch from 'minimatch';

export interface RedirectProps {
    source: RegExp | string;
    target: string;
    statusCode: number;
    type: string;
}

export type RedirectFunction = (url: string) => string;

/**
 * Caches the value's type for faster execution.
 *
 * @param value
 * @return {*}
 */
function getType(value) {

    if (typeof value === 'string') {
        return 'string';
    }

    if (isRegExp(value)) {
        return 'regexp';
    }

    if (isFunction(value)) {
        return 'function';
    }

    return null;

}

export class Redirect {

    public target: string;
    public targetType: string;
    public source: string | RegExp | RedirectFunction;
    public sourceType: string;
    public statusCode: number;
    public type: string;

    constructor(props: RedirectProps) {

        this.target = props.target;
        this.targetType = getType(props.target);
        this.source = props.source;
        this.sourceType = getType(props.source);
        this.statusCode = props.statusCode || 301;
        this.type = props.type || 'path';

    }

    /**
     * @param {String|RegExp} url
     * @return {boolean}
     */
    public match(url: string): any | null {

        if (this.sourceType === 'string') {
            return minimatch(url, this.source);
        }

        if (this.sourceType === 'regexp') {
            return (this.source as RegExp).test(url);
        }

        if (this.sourceType === 'function') {
            return (this.source as RedirectFunction)(url);
        }

        return false;
    }

    public resolve(originalUrl: string, uri: string) {

        const url = (this.type === 'url') ? originalUrl : uri;
        const match = this.match(url);

        if (!match) {
            return null;
        }

        if (this.sourceType === 'string') {
            return url.replace((this.source as string).replace(/\*/g, ''), this.target.replace(/\*/g, ''));
        }

        if (this.sourceType === 'regexp') {
            return url.replace((this.source as RegExp), this.target);
        }

        // @todo this is not working, probably means `target` can be a function?
        if (this.sourceType === 'function') {
            return null; // this.target(...match);
        }

        return null;

    }

}
