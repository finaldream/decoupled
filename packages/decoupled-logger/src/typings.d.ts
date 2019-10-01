declare type AnyObject = {
    [key: string]: any;
}

declare interface GenericFunction<A, R> {
    (arg: A): R;
}
