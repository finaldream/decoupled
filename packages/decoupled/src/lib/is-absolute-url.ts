const RE_HTTP_PROTO = /^https?:\/\/|^\/\//i;

/**
 * Checks if an URL is absolute.
 * Supports http/s and relative protocols.
 */
export function isAbsoluteUrl(url: string): boolean {

    return RE_HTTP_PROTO.test(url);

}
