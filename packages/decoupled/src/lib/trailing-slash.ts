/**
 * Trailing-Slash related functions
 */


export const isFilename = (url: string): boolean => /[\w-%]+\.(\w+)$/.test(url);

export const hasTrailingSlash = (url: string): boolean => /(.+)\/$/.test(url);

export const hasMultipleTrailingSlash = (url: string): boolean => /(.+)[^:][\/]{2}$/.test(url);

export const shouldFixTrailingSlash =
    (url: string): boolean => url.length > 1 && ( !hasTrailingSlash(url) && !isFilename(url) ) || hasMultipleTrailingSlash(url);

export const fixTrailingSlash = (url: string): string => {

    if (hasMultipleTrailingSlash(url)) {
        do {
            url = url.slice(0, -1);
        } while (hasMultipleTrailingSlash(url));
        return url;
    }

    if (!shouldFixTrailingSlash(url)) {
        return url;
    }

    return `${url}/`;

};
