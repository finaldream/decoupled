import Ajv, { ErrorObject } from 'ajv';
import glob from 'glob';
import { merge } from 'lodash';
import { resolve } from 'path';

interface ContributesInterface {
    configuration: {
        title: string,
        properties: AnyObject
    };
}

export class ConfigValidator {

    private readonly validator;

    private contributes: ContributesInterface[];

    private schema: any;

    constructor(options = {}) {
        this.validator = new Ajv(options);

        this.contributes = this.autoLoadContributes();
        this.schema = this.parseSchemaFromContributes();
    }

    public validate(data): [ null | ErrorObject[] , boolean] {
        const { schema } = this;

        const validate = this.validator.compile(schema);
        const valid = validate(data);

        return [validate.errors, valid];
    }

    private parseSchemaFromContributes() {
        const result = {};

        this.contributes.forEach((item) => {
            merge(result, item.configuration);
        });

        return result;
    }

    private loadContributesFromRegisteredModules() {}

    private autoLoadContributes() {
        const contributes = glob.sync('**/decoupled.contrib.json');
        const result = [];

        contributes.forEach((contrib) => {
            result.push(require(resolve(contrib)).contributes || {});
        });

        return result;
    }
}
