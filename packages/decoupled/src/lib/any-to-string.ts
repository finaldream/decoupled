export const tryJsonStringify = (obj: any): string | null => {
    try {
        return JSON.stringify(obj, undefined, 2);
    } catch (e) {
        // noop
    }

    return null;
};

/**
 * Converts any object to a string,
 * Providing improved rendition for certain types.
 */
export const anyToString = (obj: any): string => {

    // Primitives
    if (['string', 'number', 'boolean', 'undefined'].includes(typeof obj)) {
        return String(obj);
    }

    // Error
    if (obj instanceof Error) {
        return obj.stack;
    }

    return (
        tryJsonStringify(obj)
        || obj.toString()
    );

};
