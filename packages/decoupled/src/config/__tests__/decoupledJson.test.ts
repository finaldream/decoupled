import {
  hasDecoupledJson,
  getFromDecoupledJson
} from '../decoupledJson';

describe('this is hasDecoupledJson function test', () => {
    test('expect decoupled json is not exist', () => {
        expect(hasDecoupledJson()).toBe(false);
    });
});

describe('this is getFromDecoupledJson function test', () => {
    test('expect decoupled json return default value', () => {
        const result = getFromDecoupledJson('appPath', './');
        expect(result).toBe('./');
    })
})