declare module "*.json" {
    const value: any;
    export default value;
}

declare type AnyObject = {
    [key: string]: any;
}

declare interface GenericFunction<A, R> {
    (arg: A): R;
}
