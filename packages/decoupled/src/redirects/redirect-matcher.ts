/**
 * Internal class for matching redirects against incoming subjects.
 */

import { isFunction, isRegExp } from 'lodash';
import { logger } from 'decoupled-logger';
import UrlPattern from 'url-pattern';

export type RedirectMatcherFunction = GenericFunction<string, boolean>;

const REG_URL_WILDCARDS = /^([a-z\*\?]+:)?\/\/([\w:_\.\-@\*\?]*)\/?(.*)/i;

const arrayToObject = (arr, keyPrefix = '') => {
    const result = {};
    arr.forEach((v, i) => result[`${keyPrefix}${i}`] = v);
    return result;
};

interface URLParts {
    host: string;
    path: string;
}

interface URLPartsExecutors {
    host: RegExp;
    path: UrlPattern;
}

const escapeRegexpWithWildCards = (subject: string): string => {

    let result = subject.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
    result = result.replace(/[\*]/g, '(.*)');

    return result;

};

export class RedirectMatcher {

    protected stringValue?: string;
    protected stringParts?: URLPartsExecutors;
    protected regexValue?: RegExp;
    protected functionValue?: RedirectMatcherFunction;

    constructor(subject: any) {

        if (isRegExp(subject)) {
            this.regexValue = subject;
        } else if (isFunction(subject)) {
            this.functionValue = subject as RedirectMatcherFunction;
        } else if (typeof subject === 'string') {
            this.stringValue = subject;
            this.stringParts = this.urlPartsExecutors(this.parseURLPattern(this.stringValue));
        }

    }

    /**
     * Matches a subject.
     * @param subject Subject-string to match
     * @returns an object with optional parameters or false if not matching
     */
    public match(subject: string): object | boolean {

        let result: object = null;

        if (this.stringValue) {
            result = this.matchString(subject);
        } else if (this.regexValue) {
            result = this.matchRegExp(subject);
        } else if (this.functionValue) {
            result = this.matchFunction(subject);
        }

        return result === null ? false : result;

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

    private matchString(subject: string): object {
        if (subject === this.stringValue) {
            return {};
        }

        // undefined = allows path to be processed if host is not set
        // null = host does not match, skip path as well.
        let result: object;

        const subjectParts = this.parseURLPattern(subject);

        // match the host-part with micromatch-regexp
        if (this.stringParts.host) {
            const matches = subjectParts.host.match(this.stringParts.host);
            if (matches) {
                result = arrayToObject(matches, '$');
            } else {
                result = null;
            }
        }

        // match the path-part with url-pattern
        if (result !== null && this.stringParts.path) {

            const matches = this.stringParts.path.match(subjectParts.path);

            if (matches) {
                result = {
                    ...result || {},
                    ...matches,
                };
            } else {
                result = null;
            }

        }

        logger.silly(() => ['RedirectMatcher.match strings:', this.stringValue, subject, result]);

        return result;
    }

    private matchRegExp(subject): object {
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

    private matchFunction(subject): object {
        const result = this.functionValue(subject);

        // Map matched values to their numeric keys.
        return (Array.isArray(result))
            ? arrayToObject(result, '$')
            : result;
    }

    private parseURLPattern(url: string): URLParts {

        const matches = url.match(REG_URL_WILDCARDS);

        if (!matches || matches.length < 3) {
            return {
                host: '',
                path: url,
            };
        }

        return {
            host: `${matches[1]}//${matches[2]}/`,
            path: matches[3] && matches[3].length && matches[3] !== '/' ? matches[3] : '',
        };

    }

    private urlPartsExecutors(parts: URLParts): URLPartsExecutors {

        return {
            host: parts.host ? new RegExp(escapeRegexpWithWildCards(parts.host)) : null,
            path: parts.path ? new UrlPattern(parts.path) : null,
        };
    }

}
