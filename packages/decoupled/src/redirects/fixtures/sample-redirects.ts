/**
 * Fixtures for redirect tests.
 */

export default [
    { url: /^https?:\/\/domain1\.tld/i, target: 'https://www.redirect1.tld/' },
    { url: /^https?:\/\/www\.domain2\.tld/i, target: 'https://www.redirect2.tld/' },
    { url: /^https?:\/\/www\.domain3\.tld\/(\w+)\/(\w+)/i, target: 'https://www.redirect3.tld/key/${$1}/value/${$2}/' },
    { url: 'http://www.domain4.tld(/)', target: 'https://www.redirect4.tld/' },
    { url: 'http://www.domain5.tld/:cat(/)', target: 'https://www.redirect5.tld/${cat}/' },
    { url: 'http://www.domain5.tld/:cat/:post(/)', target: 'https://www.redirect5.tld/${cat}/${post}/' },
    { url: 'http://www.domain5.tld/:cat/:post/*', target: 'https://www.redirect5.tld/${cat}/${post}/${_}' },
    {
        target: 'https://www.redirect6.tld/',
        url: (url) => url.indexOf('http://www.domain6.tld') === 0,
    },
    {
        target: 'https://www.redirect7.tld/${rest}',
        url: (url) => {
            const src = 'http://www.domain7.tld/';
            return url.indexOf(src) === 0 ? { rest: url.substr(src.length) } : false;
        },
    },
    {
        url: (url) => url.indexOf('http://www.domain8.tld/') === 0 && url.split('.tld').pop().split('/'),
        target: 'https://www.redirect8.tld/1/${$1}/2/${$2}/3/${$3}/',
    },
    // Notice: the `hostname`-property will be set by `registerRedirects` automatically, if a Site is passed.
    { hostname: 'www.path-request.tld', path: /part/i, target: 'https://www.path-request.tld/matched-part/' },
    {
        hostname: 'www.path-request.tld',
        path: /\/capture\/(\w+)\/(\w+)/i,
        target: 'https://other.path-request.tld/${$2}/${$1}/',
    },
    { hostname: 'www.path-request.tld', path: '/abc(/)', target: 'https://www.path-request.tld/cde/' },
    {
        hostname: 'www.path-request.tld',
        path: '/args/:arg1/:arg2/',
        target: 'https://other.path-request.tld/${arg2}/${arg1}/',
    },
    {
        hostname: 'www.path-request.tld',
        path: (url) => url.indexOf('login') !== -1,
        target: 'https://www.path-request.tld/auth/',
    },
    {
        hostname: 'www.path-request.tld',
        path: (url) => url.indexOf('/rest') === 0 && url.split('/'),
        target: 'https://www.path-request.tld/${$4}/${$3}/${$2}/',
    },

];
