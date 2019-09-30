declare type AnyObject = {
    [key: string]: any;
}

declare interface GenericFunction<A, R> {
    (arg: A): R;
}

export class Logger {
    constructor(...args: any[]);

    checkLevel(...args: any[]): void;

    debug(...args: any[]): void;

    deprecate(...args: any[]): void;

    error(...args: any[]): void;

    http(...args: any[]): void;

    info(...args: any[]): void;

    initTransports(...args: any[]): void;

    log(...args: any[]): void;

    silly(...args: any[]): void;

    verbose(...args: any[]): void;

    warn(...args: any[]): void;

}

export function logFormat(label: any, options: any): any;
