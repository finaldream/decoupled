export type Nullable<T> = T | null;

export declare type AnyObject = {
    [key: string]: any;
}

export declare interface GenericFunction<A, R> {
    (arg: A): R;
}

export * from './lib/decoupled-cloudfront';

export as namespace DecoupledCloudfront;
