/**
 * Services Container
 */

import { upperFirst, camelCase } from 'lodash';
import fs from 'fs';
import path from 'path';
import logger from '../logger';

const REGEX_JS_FILES = new RegExp('^([^.]+(?!(\\.spec|\\.test|\\.mock)))(\\.[^.]+)*\\.js$');

const NAME_SPACE = 'Dcoupled';

/**
 * ServiceContainer class
 */
export class ServiceContainer {

    public autoloadPath: string;
    private services: object;

    /**
     * ServiceContainer constructor
     */
    constructor() {
        this.services = {};
    }

    /**
     * Autoload all file in provided path
     *
     * @param {string} autoloadPath
     */
    public async autoload(autoloadPath = '../services') {
        this.autoloadPath = this._resolve(autoloadPath);

        await this._autoload();
    }

    /**
     * Resolve path
     * @param {string} input
     * @returns {string}
     * @private
     */
    public _resolve(input) {
        return (path.isAbsolute(input)) ? input : path.resolve(__dirname, input);
    }

    /**
     * Do autoload
     * @private
     */
    public async _autoload() {
        if (!fs.statSync(this.autoloadPath).isDirectory()) {
            logger.error(`ServiceContainer: ${this.autoloadPath} is not a directory.`);
        }

        const files = fs.readdirSync(this.autoloadPath);

        for (const file of files) {
            const match = file.match(REGEX_JS_FILES);
            if (!match) {
                continue;
            }

            const moduleName = this._formatModuleName(match[1]);
            this.services[moduleName] = require(path.join(this.autoloadPath, file));
        }

        logger.info(`ServiceContainer: Autoloaded ${Object.keys(this.getAll()).length} services.`);
    }

    /**
     * Format module name
     *
     * Current format is `Dcoupled\SampleService`
     *
     * @param {string} str
     * @returns {string}
     * @private
     */
    public _formatModuleName(str) {
        return `${NAME_SPACE}/${upperFirst(camelCase(str))}`;
    }

    /**
     * Custom module binding on-demand
     * @param {string} customPath
     * @param {string} customName
     */
    public bind(customPath, customName = false) {
        const modulePath = (customPath.endsWith('.js')) ?
            this._resolve(customPath) :
            this._resolve(`${customPath}.js`);

        this._bind(modulePath, customName);
    }

    /**
     * Do custom binding
     * @param modulePath
     * @param customName
     * @private
     */
    public _bind(modulePath, customName) {

        const match = modulePath.match(REGEX_JS_FILES);

        // Validate module path
        if (!fs.statSync(modulePath).isFile() || !match) {
            logger.error(`ServiceContainer: ${modulePath} is not a valid module.`);
        }

        const moduleName = (typeof customName === 'string' && customName.length > 0) ?
            customName :
            this._formatModuleName(match[1]);

        try {
            this.services[moduleName] = require(modulePath);
        } catch (e) {
            logger.error(`ServiceContainer: Could not load ${modulePath}.`);
        }
    }

    public has(name) {
        return (typeof this.services[name] !== undefined);
    }

    /**
     * Get a module from this container
     * @param name
     * @returns {*}
     */
    public use(name) {
        if (!this.has(name)) {
            logger.error(`ServiceContainer: Could not find any module named ${name}.`);
            return null;
        }

        return this.services[name];
    }

    /**
     * Get all services
     * @returns {{}|*}
     */
    public getAll() {
        return this.services;
    }
}

export default new ServiceContainer();

