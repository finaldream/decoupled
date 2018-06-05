/**
 * Simple request-logger middleware
 */

import logger from '../../logger';

export default (req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
};
