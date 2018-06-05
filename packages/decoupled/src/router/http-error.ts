/**
 * Error to be thrown on HTTP-Requests
 */

import HttpStatus from 'http-status-codes';

export default class HttpError extends Error {

    public statusCode: number;

    constructor(statusCode, message) {
        super(message || HttpStatus.getStatusText(statusCode));
        this.statusCode = statusCode;
    }

}
