
export type LogLevelMethod = (...args) => void;
export type LogMethod = (level: string, ...args) => void;

export interface LoggerInterface {
    error: LogLevelMethod;
    warn: LogLevelMethod;
    info: LogLevelMethod;
    http: LogLevelMethod;
    verbose: LogLevelMethod;
    debug: LogLevelMethod;
    silly: LogLevelMethod;
    log: LogMethod;
}
