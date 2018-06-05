/**
 * Expires header middleware
 */

const { config } = require('multisite-config');

const ExpiresHeader = (req, res, next) => {

    /**
     * Set expires headers
     * @param ttl
     */
    res.expires = (ttl) => {
        res.header('Cache-Control', `public, max-age=${ttl}`);
        res.header('Expires', new Date(Date.now() + ttl * 1000).toUTCString());

        return res;
    };

    /**
     * Set expire header for static files
     */
    const staticExpires = config.get('router.staticExpires', []);

    for (let i = 0; i < staticExpires.length; i++) {
        const uri = staticExpires[i];

        if (uri.match.test(req.url)) {
            res.expires(uri.expires);
            break;
        }
    }

    next();
};

export default ExpiresHeader;
