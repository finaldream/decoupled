type Nullable<T> = T | null;

declare interface AnyObject {
    [key: string]: any;
}

declare interface GenericFunction<A, R> {
    (arg: A): R;
}
