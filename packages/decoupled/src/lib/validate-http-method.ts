export const HttpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

/**
 * Validates a provided method. Works case-insensitive.
 *
 * @throws if an unsupported method is provided.
 * @param {string} method
 */
export function validateHttpMethod(method: string) {
    if (!HttpMethods.includes(method.toUpperCase())) {
        throw new Error(`Unsupported HTTP method ${method}`);
    }
}
