import { Site } from '../site/site';

export interface CacheInterface {

    /**
     * gets value for key
     */
    get(key: string): Promise<any>;

    /**
     * sets the value for a key with optional ttl for expiry.
     * @param key to set
     * @param value to store
     * @param ttl time (msec) for the value to expire
     */
    set(key: string, value: any, ttl: number): boolean;

    /**
     * delete a key
     * @param key key to delete
     */
    delete(key: string): void;

    /**
     * Clears the whole cache.
     */
    clear(): void;

}
