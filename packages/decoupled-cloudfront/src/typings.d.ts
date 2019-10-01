declare type AnyObject = {
    [key: string]: any;
}

type Nullable<T> = T | null;

declare interface GenericFunction<A, R> {
    (arg: A): R;
}
