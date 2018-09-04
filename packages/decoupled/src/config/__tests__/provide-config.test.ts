import path from 'path';
import { get } from 'lodash';
import { 
    readConfigFromFiles,
    getFilePattern,
    loadConfig,
    provideConfig
} from '../provide-config';
import { appPath } from '../../lib';

describe('This is getFilePattern function test', () => {
    test('expect getFilePattern function with default param', () => {
        const filePattern = getFilePattern();
        expect(new RegExp(filePattern)).toEqual(/^([^.]*.(js)$)/);
    });
    test('expect getFilePattern function with string param', () => {
        const filePattern = getFilePattern('moneyonmymind.de');
        expect(new RegExp(filePattern)).toEqual(/^([^.]*.(moneyonmymind.de.js)$)/);
    });
});

describe('This is readConfigFromFiles function test', () => {
    test('expect readConfigFromFiles function with directory is not exist', () => {
        // const defaultPath = path.join(path.resolve(), '/src/config');
        try {
            readConfigFromFiles('example', getFilePattern());
        } catch (error) {
            expect(error.toString()).toEqual("Error: ENOENT: no such file or directory, stat 'example'");
        }
    });

    test('expect readConfigFromFiles function with directory is exist', () => {
        const rootPath = path.join(path.resolve(), '/src/config/__tests__/config/example');
        const result = readConfigFromFiles(rootPath, getFilePattern());
        expect(result.example.title).toEqual('example');
    });
});

describe('This is loadConfig function test', () => {
    test('expect readConfigFromFiles function', () => {
        const rootPath = path.join(path.resolve(), '/src/config/__tests__/config/');
        const env = process.env.NODE_ENV;
        const result = loadConfig('example', env, rootPath);
        expect(result.example.title).toEqual('example');
    });
});

describe('This is provideConfig function test', () => {
    test('expect provideConfig function', () => {
        const rootPath = path.join(path.resolve(), '/src/config/__tests__/config/');
        const env = process.env.NODE_ENV;
        const result = provideConfig('example', env, rootPath);
        expect(result['config']['example'].title).toEqual('example');
        expect(result['config']['default'].title).toEqual('default');
    });
});