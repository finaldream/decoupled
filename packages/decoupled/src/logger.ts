/**
 * Winston Logger
 */

import { config } from 'multisite-config';
import winston, { Logger } from 'winston';

function formatTimestamp() {
    const date = new Date().toLocaleDateString('en-GB');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    return `[${date} ${time}]`;
}

function logger(): any {

    const defaultOptions = {
        Console: {
            logLevel: process.env.LOG_LEVEL || 'debug',
        },
    };

    const logging = config.get('logging', defaultOptions);
    const transports = [];

    Object.entries(logging).forEach(([type, configs]) => {

        if (typeof winston.transports[type] === 'undefined') {
            return false;
        }

        const options: any = configs;

        options.timestamp = formatTimestamp;
        options.level = process.env.LOG_LEVEL || options.logLevel || 'info';
        options.colorize = true;

        transports.push(new (winston.transports[type])(options));

        return true;
    });

    const loggerInstance = new Logger();
    loggerInstance.configure({ transports });
    return loggerInstance;
}

export default logger();
