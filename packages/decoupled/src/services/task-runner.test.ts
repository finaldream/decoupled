/**
 * Task Runner Test
 */

import sinon from 'sinon';
import { TaskRunner } from './task-runner';
import { Site } from '../site/site';

let taskOneValue = 0;
let taskTwoValue = 10;
let taskThreeValue = 0;

const tasks = [
    {
        handler: (site: Site) => taskOneValue++,
        interval: '*/5 * * * * *',
        startup: true,
    },
    {
        handler: (site: Site) => taskTwoValue++,
        interval: '*/10 * * * * *',
    },
];

describe.skip('TaskRunner', () => {


    const site = new Site('default');

    test('it should register tasks correctly', () => {
        const clock = sinon.useFakeTimers();

        const taskRunner = new TaskRunner(site, tasks);
        taskRunner.init();

        expect(taskOneValue).toBe(1);
        expect(taskTwoValue).toBe(10);

        expect(taskRunner.registedTasks.length).toBe(2);

        clock.tick(5000);

        expect(taskOneValue).toBe(2);
        expect(taskTwoValue).toBe(10);

        clock.tick(5000);

        expect(taskOneValue).toBe(3);
        expect(taskTwoValue).toBe(11);

        taskRunner.stopAll();
    });

    test('it should stop all tasks correctly', () => {

        const taskRunner = new TaskRunner(site, tasks);
        taskRunner.init();

        expect(taskRunner.getRunningTasks().length).toBe(2);

        taskRunner.stopAll();

        expect(taskRunner.getRunningTasks().length).toBe(0);
    });

    test('it should start all tasks correctly', () => {

        const taskRunner = new TaskRunner(site, tasks);
        taskRunner.init();

        expect(taskRunner.getRunningTasks().length).toBe(0);

        taskRunner.startAll();

        expect(taskRunner.getRunningTasks().length).toBe(2);
    });

    test('it should only run once for a future Date', () => {
        const date = new Date();
        const clock = sinon.useFakeTimers(date.getTime());
        const seconds = date.getSeconds() + 10;

        const taskRunner = new TaskRunner(site, tasks);
        taskRunner.init();

        date.setSeconds(seconds);

        taskRunner.register(date, () => taskThreeValue++);

        expect(taskThreeValue).toBe(0);

        expect(taskRunner.getRunningTasks().length).toBe(3);

        clock.tick(10000);

        expect(taskThreeValue).toBe(1);
        expect(taskRunner.getRunningTasks().length).toBe(2);
    });
});
