/**
 * HTTP Basic Authentication Middleware
 *
 * TODO: Support Config
 * TODO: support multiple users
 */

import basicAuth from 'basic-auth';

export default () => {
    const username = process.env.BASIC_AUTH_USERNAME || null;
    const password = process.env.BASIC_AUTH_PASSWORD || null;

    function unauthorized(res) {
        res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    return (req, res, next) => {
        // if no auth is set, skip it.
        if (username === null || password === null) {
            return next();
        }

        const user = basicAuth(req);

        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        }

        if (user.name === username && user.pass === password) {
            return next();
        }

        return unauthorized(res);
    };
};
