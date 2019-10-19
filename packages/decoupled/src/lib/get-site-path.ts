import { resolve } from 'path';

/**
 * Gets a path based on the specified site
 * @param siteId site the path is based on
 * @param subPaths additional sub-paths. 
 */
export const getSitePath = (siteId: string, ...subPaths: string[]): string => resolve('app', 'sites', siteId, ...subPaths);
