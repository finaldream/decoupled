import { fixTrailingSlash, shouldFixTrailingSlash } from './trailing-slash';

const runCases = (cases, hostname?: string) => {
    cases.forEach((testCase, index) => {
        test(`#${index} (${testCase.request})`, () => {
            const should = shouldFixTrailingSlash(testCase.request);
            const result = fixTrailingSlash(testCase.request);
            expect(should === false ? testCase.request : result).toBe(testCase.expect);
        });
    });
};

describe('Trailing Slashes', () => {
    runCases([
        { request: 'http://www.domain1.tld/resource', expect: 'http://www.domain1.tld/resource/' },
        { request: 'http://www.domain1.tld/resource/', expect: 'http://www.domain1.tld/resource/' },
        { request: 'http://www.domain1.tld/resource//', expect: 'http://www.domain1.tld/resource/' },
        { request: 'http://www.domain1.tld/resource///////', expect: 'http://www.domain1.tld/resource/' },
    ])
});
