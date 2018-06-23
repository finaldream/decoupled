/**
 * Simple request-logger middleware
 */


export default (logger) => (req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
};
