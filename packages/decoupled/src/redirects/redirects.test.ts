/**
 * Test-cases for redirect functionality.
 */
import samples from './fixtures/sample-redirects';
import { registerRedirects, resolveRedirect } from './redirect-store';
import { dummyReq } from '../lib';


const runCases = (cases, hostname?: string) => {
    cases.forEach((testCase, index) => {
        test(`#${index} (${testCase.request})`, () => {
            const req = dummyReq(testCase.request);
            const result = resolveRedirect(req);
            expect(result === null ? null : result.target).toBe(testCase.expect);
        });
    });
};

describe('Redirect', () => {

    beforeAll(() => {
        registerRedirects(samples);
    });

    describe('it will process RegExp-URLs properly', () => {

        runCases([
            { request: 'http://domain1.tld/', expect: 'https://www.redirect1.tld/' },
            { request: 'https://domain1.tld/', expect: 'https://www.redirect1.tld/' },
            { request: 'http://www.domain2.tld/', expect: 'https://www.redirect2.tld/' },
            { request: 'https://www.domain2.tld/', expect: 'https://www.redirect2.tld/' },
            {
                request: 'http://www.domain3.tld/hello/world/',
                expect: 'https://www.redirect3.tld/key/hello/value/world/',
            },
        ]);

    });

    describe('it will process String-URLs properly', () => {

        runCases([
            { request: 'http://www.domain4.tld', expect: 'https://www.redirect4.tld/' },
            { request: 'http://www.domain4.tld/', expect: 'https://www.redirect4.tld/' },
            { request: 'http://www.domain5.tld/lorem/', expect: 'https://www.redirect5.tld/lorem/' },
            { request: 'http://www.domain5.tld/lorem/ipsum/', expect: 'https://www.redirect5.tld/lorem/ipsum/' },
            {
                request: 'http://www.domain5.tld/lorem/ipsum/dolor',
                expect: 'https://www.redirect5.tld/lorem/ipsum/dolor',
            },
        ]);

    });

    describe('string URLs may contain simple wildcards', () => {


        runCases([
            {
                request: 'http://dev.string-wildcards.tld/lorem/ipsum/',
                expect: 'http://www.redirect-wildcards.tld/dev/lorem/ipsum/',
            },
            {
                request: 'http://dev.string-wildcards.de/lorem/ipsum/',
                expect: 'http://www.redirect-wildcards.de/dev/lorem/ipsum/',
            },
        ]);

    });

    describe('it will process Function-URLs properly', () => {

        runCases([
            { request: 'http://www.domain6.tld', expect: 'https://www.redirect6.tld/' },
            { request: 'http://www.domain7.tld/a/b/c/d/', expect: 'https://www.redirect7.tld/a/b/c/d/' },
            { request: 'http://www.domain7.tld/a/', expect: 'https://www.redirect7.tld/a/' },
            {
                request: 'http://www.domain8.tld/lorem/ipsum/dolor/',
                expect: 'https://www.redirect8.tld/1/lorem/2/ipsum/3/dolor/',
            },
        ]);

    });

    describe('it will process paths properly', () => {

        runCases([
            { request: 'https://www.path-request.tld/any/part/', expect: 'https://www.path-request.tld/matched-part/' },
            { request: 'https://other.path-request.tld/any/part/', expect: null },
            {
                request: 'https://www.path-request.tld/capture/any/thing/',
                expect: 'https://other.path-request.tld/thing/any/',
            },
            { request: 'https://www.path-request.tld/abc/', expect: 'https://www.path-request.tld/cde/' },
            { request: 'https://www.path-request.tld/abc', expect: 'https://www.path-request.tld/cde/' },
            {
                request: 'https://www.path-request.tld/args/key/val/',
                expect: 'https://other.path-request.tld/val/key/',
            },
            { request: 'https://www.path-request.tld/my/login/', expect: 'https://www.path-request.tld/auth/' },
            {
                request: 'https://www.path-request.tld/rest/lorem/impsum/dolor/sit/amet/',
                expect: 'https://www.path-request.tld/dolor/impsum/lorem/',
            },
        ]);

    });

    describe('it will process resolve-handlers properly', () => {

        runCases([
            {
                request: 'https://www.resolve-handler.tld/a/b/c/',
                expect: 'https://www.resolved-the-redirect.tld/a/b/c/',
            },
            {
                request: 'https://direct-handler.tld/a/b/c/',
                expect: 'http://directly-resolved-the-redirect.tld',
            },
        ]);

    });
});
