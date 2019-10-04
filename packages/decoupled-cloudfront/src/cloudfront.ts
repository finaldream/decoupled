/**
 * AWS CloudFront
 */

import AWS from 'aws-sdk';
import uuid from 'uuid/v4';
import Decoupled from 'decoupled';

export class CloudFront {

    private logger: Decoupled.Logger;
    private backendNotify: Decoupled.BackendNotify;
    private distributionId: string;
    private client: AWS.CloudFront;

    constructor(decoupledSite: Decoupled.Site) {
        this.logger = decoupledSite.logger;
        this.backendNotify = decoupledSite.backendNotify;


        const { accessKey, secretKey } = decoupledSite.config.get('services.amazon.awsConfig', {});
        this.distributionId = decoupledSite.config.get('services.amazon.cloudfront.distributionId');
        if (this.distributionId && accessKey && secretKey) {
            this.logger.debug('CloudFront Invalidation support enabled.');
        } else {
            this.logger.debug('CloudFront Invalidation support disabled.');
            return;
        }

        this.client = new AWS.CloudFront({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        });
    }

    public invalidate(paths: string[]) {

        if (!this.client) {
            return;
        }

        this.logger.debug('CloudFront.invalidate:', paths);

        const params: AWS.CloudFront.CreateInvalidationRequest = {
            DistributionId: this.distributionId,
            InvalidationBatch: {
                CallerReference: `cf-invalidate-${uuid()}`,
                Paths: {
                    Quantity: paths.length,
                    Items: paths,
                },
            },
        };

        this.client.createInvalidation(params, (err, data) => {
            if (err) {
                this.logger.error('CloudFront.invalidate:', err);
                this.backendNotify.sendNotification(err, ['Cache', 'CloudFront', 'Error']);
            } else {
                this.logger.debug('CloudFront.invalidate:', data);
                this.backendNotify.sendNotification(data, ['Cache', 'CloudFront']);
            }
        });
    }
}
