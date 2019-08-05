import { fixTrailingSlash, shouldFixTrailingSlash, hasMultipleTrailingSlash } from './trailing-slash';

const runCases = (cases, hostname?: string) => {
    cases.forEach((testCase, index) => {
        test(`#${index} (${testCase.request})`, () => {
            const should = shouldFixTrailingSlash(testCase.request);
            const result = fixTrailingSlash(testCase.request);
            expect(should === false ? testCase.request : testCase.expect).toBe(result);
        });
    });
};

const randomSlahes = '/'.repeat(Math.floor(Math.random() * (1000 - 3 + 1) ) + 3);

describe('Trailing Slashes', () => {
    describe('it will process RegExp-URLs properly', () => {
        const expected = 'http://www.domain1.tld/resource/';
        runCases([
            { request: 'http://www.domain1.tld/resource', expect: expected },
            { request: 'http://www.domain1.tld/resource/', expect: expected },
            { request: 'http://www.domain1.tld/resource//', expect: expected },
            { request: 'http://www.domain1.tld/resource///////', expect: expected },
            { request: `http://www.domain1.tld/resource${randomSlahes}`, expect: expected },
            { request: `http://www.domain1.tld/resource${'/'.repeat(10000)}`, expect: expected },
        ])
    });
    describe('Detect if there are more than one trailing slash', () => {
        test('No trailing slash, should return false', () => {
            expect(hasMultipleTrailingSlash('http://www.domain1.tld/resource')).toBeFalsy();
        });
        test('One trailing slash, should return false', () => {
            expect(hasMultipleTrailingSlash('http://www.domain1.tld/resource/')).toBeFalsy();
        });
        test('Two trailing slash, should return true', () => {
            expect(hasMultipleTrailingSlash('http://www.domain1.tld/resource//')).toBeTruthy();
        });
        test('Random 3-1000 More than two trailing slashes, should return true', () => {
            expect(hasMultipleTrailingSlash(`http://www.domain1.tld/resource${randomSlahes}`)).toBeTruthy();
        });
    });
});
