/**
 * Retrieves the host-url from the provided request.
 * Contains
 */

'use strict';

export function getHostUrl(request) {

    if (!request || !request.headers || !request.connection) {
        return '';
    }

    const headers = request.headers;
    const host = headers['x-forwarded-host'] ? headers['x-forwarded-host'] : headers.host || '';
    const protocol = headers['cloudfront-forwarded-proto']
        || headers['x-forwarded-proto'] || request.protocol || 'http';

    return `${protocol}://${host}`;

}
