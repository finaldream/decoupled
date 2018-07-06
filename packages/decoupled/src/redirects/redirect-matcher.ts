/**
 * Internal class for matching redirects against incoming subjects.
 */

import { isFunction, isRegExp } from 'lodash';
import { logger } from '../logger';
import UrlPattern from 'url-pattern';

export type RedirectMatcherFunction = GenericFunction<string, boolean>;

const REG_PROTO_UNENCODED = /^(\w*):\/\/(.*)$/;

const arrayToObject = (arr, keyPrefix = '') => {
    const result = {};
    arr.forEach((v, i) => result[`${keyPrefix}${i}`] = v);
    return result;
};

export class RedirectMatcher {

    protected stringValue?: string;
    protected regexValue?: RegExp;
    protected functionValue?: RedirectMatcherFunction;

    constructor(subject: any) {

        if (isRegExp(subject)) {
            this.regexValue = subject;
        } else if (isFunction(subject)) {
            this.functionValue = subject as RedirectMatcherFunction;
        } else if (typeof subject === 'string') {
            this.stringValue = this.fixUrlPattern(subject);
        }

    }

    /**
     * Matches a subject.
     * @param subject Subject-string to match
     * @returns an object with optional parameters or false if not matching
     */
    public match(subject: string): object | boolean {

        if (this.stringValue) {

            const pattern = new UrlPattern(this.stringValue);
            const result = pattern.match(subject);

            logger.silly(() => ['RedirectMatcher.match strings:', this.stringValue, subject, result]);
            if (result === null) {
                return false;
            }

            return result;

        }

        if (this.regexValue) {
            const matches = subject.match(this.regexValue);

            logger.silly(() => ['RedirectMatcher.match Regex', matches]);

            // Map matched values to their numeric keys.
            // About '$': _.template() does only support valid variable-names, no numbers
            const result = Array.isArray(matches) && matches.length
                ? arrayToObject(matches, '$')
                : null;

            logger.silly(() => ['RedirectMatcher.match regexValue', result]);

            return result;
        }

        if (this.functionValue) {
            const result = this.functionValue(subject);

            // Map matched values to their numeric keys.
            return (Array.isArray(result))
                ? arrayToObject(result, '$')
                : result;
        }

        return false;

    }

    public toString() {
        if (this.stringValue) {
            return this.stringValue;
        } else if (this.regexValue) {
            return this.regexValue.toString();
        } else if (this.functionValue) {
            return this.functionValue.toString();
        }
    }

    /**
     * Will try to automatically encode the protocoll part of a URL, so it can be used with URL-Pattern
     * TODO: we will possibly need to encode auth and port-pattern also, as they can contain ":" as well
     *
     * @param subject subject to fix
     */
    private fixUrlPattern(subject: string): string {


        if (REG_PROTO_UNENCODED.test(subject)) {
            return subject.replace(REG_PROTO_UNENCODED, '$1\\://$2');
        }

        return subject;

    }

}
