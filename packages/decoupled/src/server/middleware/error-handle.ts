/**
 * Error handle middleware
 */

import logger from '../../logger';

export default (err, req, res, next) => {
    if (err) {
        const statusCode = err.statusCode || 500;

        logger.log(`${statusCode}: ${err.message}`);

        res.status(statusCode).render({
            data: {
                error: {
                    message: statusCode === 404 ? 'Oops, 404 not found!' : 'Oops, Error occurred!',
                    statusCode,
                    trace: process.env.NODE_ENV !== 'production' ? err : false,
                },
            },
            meta: {
                template: 'error',
            },
        });
    } else {
        next();
    }
};
