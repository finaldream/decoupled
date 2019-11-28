import { join, resolve } from 'path';
import { existsSync } from 'fs';
import glob from 'glob';
import * as TJS from 'typescript-json-schema';
import Ajv, { ErrorObject, Options } from 'ajv';
import addKeywords from 'ajv-keywords';
import { Definition } from 'typescript-json-schema';

import { logger } from '../logger';
import { getFromDecoupledConfig } from './decoupled-config';
import { getSiteIDs } from '../lib/get-site-ids';

interface DefsSchemaInterface {
    $schema ?: string;
    definitions ?: Definition;
}

interface JSONSchemaInterface {
    type: string;
    properties: {};
    required: string[];
}

export class ConfigValidator {

    private readonly validator;

    private contributes: string[];

    private defsSchema: DefsSchemaInterface;

    private schema: JSONSchemaInterface;

    private contributeFileName = 'decoupled.d.ts';

    constructor(
        private readonly validatorOptions: Options = {},
        private readonly TJSSettings: TJS.PartialArgs = {
            id: 'decoupled.contrib.json',
            defaultProps: true,
            noExtraProps: true,
            required: true,
        },
        private readonly TJSCompilerOptions: TJS.CompilerOptions = {
            strictNullChecks: true,
            useTypeOfKeyword: true,
        },
    ) {
        this.validator = new Ajv(validatorOptions);

        addKeywords(this.validator, ['typeof']);

        this.contributes = this.loadContributes();
        this.defsSchema = this.generateDefinitionsSchema();
        this.schema = this.generateSchemaFromDefinitions();
    }

    get autoloadPattern() {
        return `'**/${this.contributeFileName}'`;
    }

    /**
     * Validate input data
     * @param data
     */
    public validate(data: AnyObject): [ null | ErrorObject[] , boolean] {
        const { defsSchema, schema } = this;

        const validate = this.validator
            .addSchema(defsSchema)
            .compile(schema);
        const valid = validate(data);

        return [validate.errors, valid];
    }

    /**
     * Generate definitions schema from decoupled contributes
     */
    private generateDefinitionsSchema(): DefsSchemaInterface {
        const { contributes, TJSSettings, TJSCompilerOptions } = this;

        const program = TJS.getProgramFromFiles(contributes, TJSCompilerOptions);

        return TJS.generateSchema(program, '*', TJSSettings, contributes);
    }

    /**
     * Generate actual schema from definitions schema
     */
    private generateSchemaFromDefinitions(): JSONSchemaInterface {
        const { defsSchema: { definitions = {} } } = this;

        const properties = Object.entries(definitions).reduce((init, [k, v]) => {
            init[k.toLowerCase()] = { $ref: `decoupled.contrib.json#/definitions/${k}` };
            return init;
        }, {});

        const required = Object.keys(properties)
            .filter((k) => k[0] !== '$'); // Filter out common types with leading $

        return {
            type: 'object',
            properties,
            required,
        };
    }

    /**
     * Load contributes file locations
     */
    private loadContributes() {
        const modules = getFromDecoupledConfig('modules');

        if (modules && Array.isArray(modules) && modules.length > 0) {
            return this.loadContributesFromModules(modules);
        }

        logger.warn('No modules config found in Decoupled Config.');

        return this.autoLoadContributes();
    }

    /**
     * Load contributes file locations from decoupled.config
     *
     * 1. Root and `src` directories
     * 2. Sites directories
     * 3. Modules directories under `node_modules`
     */
    private loadContributesFromModules(modules: string[]) {
        const { contributeFileName } = this;

        const srcDir = getFromDecoupledConfig('srcDir');
        const projectContributes = [ './', srcDir ];

        const siteIDs = getSiteIDs(resolve(srcDir, 'sites'), true);
        const siteContributes = siteIDs.map((site) => join(srcDir, 'sites', site));

        const modulesContributes = ['decoupled', ...modules].map((path) => join('node_modules', path));

        return [...projectContributes, ...siteContributes, ...modulesContributes]
            .map((contrib) => resolve(contrib, contributeFileName))
            .filter((path) => existsSync(path));
    }

    /**
     * Autoload contributes file locations using glob
     */
    private autoLoadContributes() {
        const { autoloadPattern } = this;

        logger.info(`Autoloading from all directories using ${autoloadPattern} pattern.`);

        return glob.sync(autoloadPattern);
    }
}
