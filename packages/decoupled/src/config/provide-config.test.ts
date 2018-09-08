import path from 'path';
import { 
    loadConfig,
    provideConfig
} from './provide-config';

describe('loadConfig()', () => {
    test('should return value config of example', () => {
        const rootPath = path.resolve('src/fixtures/config/');
        const env = process.env.NODE_ENV;
        const result = loadConfig('example', env, rootPath);
        expect(result.example.title).toEqual('example');
    });
});

describe('provideConfig()', () => {
    test('expect return merge config of example and default', () => {
        const rootPath = path.resolve('src/fixtures/config/');
        const env = process.env.NODE_ENV;
        const result = provideConfig('example', env, rootPath);
        expect(result['config']['example'].title).toEqual('example');
        expect(result['config']['default'].title).toEqual('default');
    });
});