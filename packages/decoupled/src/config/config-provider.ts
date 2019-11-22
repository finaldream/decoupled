import { Config } from './config';
import { ConfigValidator } from './config-validator';

const configCache = new Map();

export class ConfigProvider {

    constructor(
        private readonly siteId: string,
        private readonly env: string = process.env.NODE_ENV,
    ) {}

    public get cacheKey(): string {
        return `${this.siteId}/${this.env}`;
    }

    public load(): Config {
        const { cacheKey } = this;

        if (configCache.has(cacheKey)) {
            return configCache[cacheKey];
        }

        const configs = this.loadConfig();
        const validator = new ConfigValidator();

        const [errors, valid] = validator.validate(configs);

        const config = new Config({});

        configCache[cacheKey] = config;

        return config;
    }

    public loadConfig() {
        return {
            root: 1,
            sub: 2,
        };
    }
}
