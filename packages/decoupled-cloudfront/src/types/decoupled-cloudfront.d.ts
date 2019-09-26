/**
 * AWS CloudFront
 */
export default class CloudFront {
    private site;
    private logger;
    private backendNotify;
    private distributionId;
    private client;
    constructor(site: any);
    invalidate(paths: string[]): void;
}
