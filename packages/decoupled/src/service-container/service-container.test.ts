/**
 * Service Container Test
 */

import { ServiceContainer } from './service-container';
import { TaskRunner } from '../services/task-runner';

let services = null;
let use = null;

describe('ServiceContainer', () => {

    beforeEach(() => {
        services = new ServiceContainer();
        use = services.use.bind(services);
    });

    test('it should have 0 services before autoload', async () => {
        expect(Object.keys(services.getAll())).toEqual([]);
    });

    test('it should have correct services when autoloaded', async () => {
        await services.autoload();

        expect(Object.keys(services.getAll())).toContain('Decoupled/TaskRunner');
    });

    test('it should return undefined service before autoload', () => {
        const taskRunner = use('Decoupled/TaskRunner');

        expect(taskRunner).toBeUndefined();
    });

    // TODO: There's an issue with autoload and the way TS handles default-exports
    test.skip('it should return correct service after autoloaded', async () => {
        await services.autoload();

        const taskRunner = use('Decoupled/TaskRunner');

        expect(taskRunner).toBeInstanceOf(TaskRunner);
    });

    test('it should bind custom module correctly', () => {

        services.bind('../services/task-runner', 'MyTaskRunner');

        expect(Object.keys(services.getAll())).toContain('MyTaskRunner');
    });

});
