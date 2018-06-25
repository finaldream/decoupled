/**
 * http.ServerResponse helpers
 */

const StatusCodeHelper = (req, res, next) => {
    /**
     * Set HTTP status code
     * @param statusCode
     */
    res.status = (statusCode) => {
        res.statusCode = parseInt(statusCode, 10) || 500;

        return res;
    };

    /**
     * Send HTTP status code
     * @param statusCode
     */
    res.sendStatus = (statusCode) => res.status(statusCode).end();

    next();
};

export default StatusCodeHelper;
