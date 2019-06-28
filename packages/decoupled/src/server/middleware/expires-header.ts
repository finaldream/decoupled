/**
 * Expires header middleware
 */

export default () => (req, res, next) => {

    /**
     * Set expires headers
     * @param ttl
     */
    res.expires = (ttl) => {
        res.header('Cache-Control', `public, max-age=${ttl}`);
        res.header('Expires', new Date(Date.now() + ttl * 1000).toUTCString());

        return res;
    };

    next();
};
