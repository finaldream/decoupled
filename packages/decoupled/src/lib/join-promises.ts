import { AsyncFunction } from './types/async-function';

/**
 * Joins the result of multiple parallel promises into an array
 */
export function joinPromises(promises: AsyncFunction[], ...args: any[]): Promise<any[]> {
    if (!Array.isArray(promises)) {
        return promises;
    }

    const result = [];

    promises.forEach((promise) => {
        result.push(promise(...args));
    });

    const catchHandler = (error) => ({ error });
    const successHandler = (res) => res;

    return Promise.all(result.map((promise) => promise.then(successHandler).catch(catchHandler)));
}
