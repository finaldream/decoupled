import { isTestEnvironment } from './is-test-environment';

describe('isTestEnvironment()', () => {

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });


    test('should return true while running in test', () => {
        expect(isTestEnvironment()).toBe(true);
    });

    test('should return false when NODE_ENV is other than "test"', () => {
        process.env.NODE_ENV = 'development';
        expect(isTestEnvironment()).toBe(false);
        process.env.NODE_ENV = 'production';
        expect(isTestEnvironment()).toBe(false);
    });

    test('should return false when process.env is undefined', () => {
        process.env.NODE_ENV = undefined;
        expect(isTestEnvironment()).toBe(false);
        process.env = undefined;
        expect(isTestEnvironment()).toBe(false);
    });

});
