import {
    createLogger,
    Logger as WinstonLogger,
    transports,
} from 'winston';
import * as Transport from 'winston-transport';
import { LoggerInterface } from './logger-interface';
import { anyToString } from '../lib/any-to-string';

export class Logger implements LoggerInterface {

    private logger: WinstonLogger;

    constructor(options: AnyObject = {}) {

        const opts = {
            ...options,
            transports: this.initTransports(options.transports),
        };

        this.logger = createLogger(opts);
    }

    public error(...args) {
        this.log('error', ...args);
    }
    public warn(...args) {
        return this.log('warn', ...args);
    }
    public info(...args) {
        return this.log('info', ...args);
    }
    public http(...args) {
        return this.log('http', ...args);
    }
    public verbose(...args) {
        return this.log('verbose', ...args);
    }
    public debug(...args) {
        return this.log('debug', ...args);
    }
    public silly(...args) {
        return this.log('silly', ...args);
    }
    public log(level, ...args) {
        const message = (args || []).map((item) => anyToString(item));
        return this.logger.log(level, message.join(' '));
    }

    private initTransports(transportOptions: AnyObject[] = []): Transport[] {

        const result: Transport[] = [];


        for (const transport of transportOptions) {
            const { type, ...opts } = transport;

            if (!transports[type]) {
                throw new Error(`unknown transport ${type}. Choose from ${Object.keys(transports).join()}`);
            }

            result.push(new transports[type](opts));

        }

        return result;

    }

}
