import Ajv, { ErrorObject } from 'ajv';
import glob from 'glob';
import { merge } from 'lodash';
import { resolve } from 'path';

export class ConfigValidator {

    private readonly validator;

    private readonly schema;

    constructor(options = {}) {
        this.validator = new Ajv(options);

        this.schema = this.loadSchema();
    }

    public validate(data): [ null | ErrorObject[] , boolean] {
        const { schema } = this;

        const validate = this.validator.compile(schema);
        const valid = validate(data);

        return [validate.errors, valid];
    }

    private loadSchema() {
        const contributes = glob.sync('**/decoupled.contrib.json');
        const result = {};

        contributes.forEach((contrib) => {
            merge(result, (require(resolve(contrib)) || {}));
        });

        return result;
    }
}
