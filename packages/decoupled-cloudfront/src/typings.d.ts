declare interface AnyObject {
    [key: string]: any;
}

type Nullable<T> = T | null;

declare type GenericFunction<A, R> = (arg: A) => R;
