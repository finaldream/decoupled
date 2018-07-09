/**
 * Internal class for resolving redirect-targets based on a previous match.
 */


import { isFunction, template, TemplateExecutor } from 'lodash';

const templateOptions = { interpolate: /\${([\s\S]+?)}/g };

export type RedirectResolverFunction = GenericFunction<object, string>;

export class RedirectResolver {

    protected stringValue?: string;
    protected stringExecutor?: TemplateExecutor;
    protected functionValue?: RedirectResolverFunction;

    constructor(subject: any) {

        if (isFunction(subject)) {
            this.functionValue = subject as RedirectResolverFunction;
        } else if (typeof subject === 'string') {
            this.stringValue = subject;
            this.stringExecutor = template(subject, templateOptions);
        }

    }

    /**
     * Resolves a previously matched pattern to a specified URL
     * @param subject subject to Resolve
     * @param params optional params to replace
     */
    public resolve(params: object): string {

        if (this.stringExecutor) {
            return this.stringExecutor(params);
        }
        if (this.functionValue) {
            return this.functionValue(params);
        }

        return null;

    }

    public toString() {
        if (this.stringValue) {
            return this.stringValue;
        } else if (this.functionValue) {
            return this.functionValue.toString();
        }
    }

}
