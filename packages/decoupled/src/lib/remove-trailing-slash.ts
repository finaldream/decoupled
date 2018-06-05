/**
 * Removes a trailing slash from a path
 */

export function removeTrailingSlash(path) {
    if (path === '/') {
        return path;
    }

    return String(path).replace(/\/$/, '');
}
