import { dummyReq, getHostUrl } from '.';

describe('makeReq()', () => {

    test('it should create a dummy request based on a given URL', () => {

        const req = dummyReq('https://sub.domain1.tld/a/b/c/d/?key=value#hash');

        expect(req).toMatchObject({
            protocol: 'https',
            hostname: 'sub.domain1.tld',
            url: '/a/b/c/d/?key=value',
            port: null,
            path: '/a/b/c/d/',
            query: '?key=value',
            hash: '#hash',
            headers: {},
            connection: {},
        });

    });

    test('it should be compatible with getHostUrl()', () => {

        const req = dummyReq('https://sub.domain1.tld/a/b/c/d/?key=value#hash');
        const hostUrl = getHostUrl(req);

        expect(hostUrl).toEqual('https://sub.domain1.tld');

    });

});
