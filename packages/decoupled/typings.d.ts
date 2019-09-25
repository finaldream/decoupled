export = decoupled;

declare module "*.json" {
    const value: any;
    export default value;
}

type Nullable<T> = T | null;

declare type AnyObject = {
    [key: string]: any;
}

declare interface GenericFunction<A, R> {
    (arg: A): R;
}

declare const decoupled: {
    logger: {
        checkLevel: any;
        debug: any;
        deprecate: any;
        error: any;
        http: any;
        info: any;
        initTransports: any;
        lazyLogging: boolean;
        log: any;
        logger: {
            add: any;
            addListener: any;
            allowHalfOpen: boolean;
            child: any;
            clear: any;
            cli: any;
            close: any;
            configure: any;
            cork: any;
            debug: any;
            defaultMeta: any;
            destroy: any;
            destroyed: boolean;
            emit: any;
            end: any;
            error: any;
            eventNames: any;
            exceptions: {
                getAllInfo: any;
                getOsInfo: any;
                getProcessInfo: any;
                getTrace: any;
                handle: any;
                handlers: Map<any, any>;
                logger: any;
                unhandle: any;
            };
            exitOnError: boolean;
            format: {
                Format: any;
                options: {
                };
                transform: any;
            };
            getMaxListeners: any;
            handleExceptions: any;
            http: any;
            info: any;
            isDebugEnabled: any;
            isErrorEnabled: any;
            isHttpEnabled: any;
            isInfoEnabled: any;
            isLevelEnabled: any;
            isPaused: any;
            isSillyEnabled: any;
            isVerboseEnabled: any;
            isWarnEnabled: any;
            level: string;
            levels: {
                debug: number;
                error: number;
                http: number;
                info: number;
                silly: number;
                verbose: number;
                warn: number;
            };
            listenerCount: any;
            listeners: any;
            log: any;
            off: any;
            on: any;
            once: any;
            pause: any;
            pipe: any;
            prependListener: any;
            prependOnceListener: any;
            profile: any;
            profilers: {
            };
            push: any;
            query: any;
            rawListeners: any;
            read: any;
            readable: boolean;
            readableBuffer: {
                clear: any;
                concat: any;
                consume: any;
                first: any;
                head: any;
                join: any;
                length: number;
                push: any;
                shift: any;
                tail: any;
                unshift: any;
            };
            readableFlowing: boolean;
            readableHighWaterMark: number;
            readableLength: number;
            rejections: {
                getAllInfo: any;
                getOsInfo: any;
                getProcessInfo: any;
                getTrace: any;
                handle: any;
                handlers: Map<any, any>;
                logger: any;
                unhandle: any;
            };
            remove: any;
            removeAllListeners: any;
            removeListener: any;
            resume: any;
            setDefaultEncoding: any;
            setEncoding: any;
            setLevels: any;
            setMaxListeners: any;
            silent: any;
            silly: any;
            startTimer: any;
            stream: any;
            transports: {
                addListener: any;
                consoleWarnLevels: {
                };
                cork: any;
                destroy: any;
                destroyed: boolean;
                emit: any;
                end: any;
                eol: string;
                eventNames: any;
                format: any;
                getMaxListeners: any;
                handleExceptions: any;
                level: string;
                levels: {
                    debug: number;
                    error: number;
                    http: number;
                    info: number;
                    silly: number;
                    verbose: number;
                    warn: number;
                };
                listenerCount: any;
                listeners: any;
                log: any;
                name: string;
                off: any;
                on: any;
                once: any;
                parent: any;
                pipe: any;
                prependListener: any;
                prependOnceListener: any;
                rawListeners: any;
                removeAllListeners: any;
                removeListener: any;
                setDefaultEncoding: any;
                setMaxListeners: any;
                silent: any;
                stderrLevels: {
                };
                uncork: any;
                writable: boolean;
                writableHighWaterMark: number;
                write: any;
            }[];
            uncork: any;
            unhandleExceptions: any;
            unpipe: any;
            unshift: any;
            verbose: any;
            warn: any;
            wrap: any;
            writable: boolean;
            writableBuffer: any[];
            writableHighWaterMark: number;
            writableLength: number;
            write: any;
        };
        silly: any;
        verbose: any;
        warn: any;
    };
};
