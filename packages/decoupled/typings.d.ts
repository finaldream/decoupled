declare module "*.json" {
    const value: any;
    export default value;
}

declare type AnyObject = {
    [key: string]: any;
}
