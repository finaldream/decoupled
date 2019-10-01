import {
    createLogger,
    Logger as WinstonLogger,
    transports,
} from 'winston';
import Chalk from 'chalk';
import * as Transport from 'winston-transport';
import { LoggerInterface } from './logger-interface';
import { anyToString } from './lib/any-to-string';

export class Logger implements LoggerInterface {

    public lazyLogging: boolean = true;
    private logger: WinstonLogger;

    constructor(options: AnyObject = {}) {

        const opts = {
            ...options,
            transports: this.initTransports(options.transports, options.level),
        };

        this.logger = createLogger(opts);
    }

    /**
     * Checks if logging for a level is allowed.
     * Configure with config `logging.level`.
     * Checks logger.level internally.
     * @param level level to test
     */
    public checkLevel(level: string): boolean {

        const levelId = this.logger.levels[level];
        const loggerLevelId = this.logger.levels[this.logger.level];

        return (
            typeof levelId !== 'undefined'
            && levelId <= loggerLevelId
        );
    }

    public deprecate(what: string, instead: string) {
        this.log('warn', Chalk.redBright('DEPRECATED:'), `${what}.`, `${instead}.`);
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

        // Skip disabled log-levels to increase performance for lazy logging
        if (this.lazyLogging && !this.checkLevel(level)) {
            return;
        }

        let argsDef = args || [];

        // Support lazy evaluation of logs at time of render vs. always
        if (this.lazyLogging && args.length === 1 && typeof args[0] === 'function') {
            argsDef = args[0]();
        }

        if (!Array.isArray(argsDef)) {
            argsDef = [argsDef];
        }

        const message = (argsDef).map((item) => anyToString(item));
        return this.logger.log(level, message.join(' '));
    }

    private initTransports(transportOptions: AnyObject[] = [], globalLevel: string = 'info'): Transport[] {

        const result: Transport[] = [];


        for (const transport of transportOptions) {
            const { type, ...opts } = transport;

            if (!transports[type]) {
                throw new Error(`unknown transport ${type}. Choose from ${Object.keys(transports).join()}`);
            }

            // allow a global level for all transports by omitting the transport-specific level.
            if (typeof opts.level === 'undefined') {
                opts.level = globalLevel;
            }

            result.push(new transports[type](opts));

        }

        return result;

    }

}
