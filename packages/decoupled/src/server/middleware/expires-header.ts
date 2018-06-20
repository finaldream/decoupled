/**
 * Expires header middleware
 */

export interface StaticExpiryItem {
    match: RegExp;
    expires: number;
}

export default (staticExpires: StaticExpiryItem[]) => (req, res, next) => {

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
    for (const item of staticExpires) {

        if (item.match.test(req.url)) {
            res.expires(item.expires);
            break;
        }
    }

    next();
};
