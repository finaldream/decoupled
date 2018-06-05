/**
 * Task Runner Test
 */

import sinon from 'sinon';
import taskRunner from './task-runner';

let taskOneValue = 0;
let taskTwoValue = 10;
let taskThreeValue = 0;

taskRunner.tasks = [
    {
        handler: () => taskOneValue++,
        interval: '*/5 * * * * *',
        startup: true,
    },
    {
        handler: () => taskTwoValue++,
        interval: '*/10 * * * * *',
    },
];

const getRunningTasks = () => {
    return taskRunner.registedTasks.filter((task) => task.running);
};

describe.skip('TaskRunner', () => {

    test('it should register tasks correctly', () => {
        const clock = sinon.useFakeTimers();

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
    });

    test('it should stop all tasks correctly', () => {
        expect(getRunningTasks().length).toBe(2);

        taskRunner.stopAll();

        expect(getRunningTasks().length).toBe(0);
    });

    test('it should start all tasks correctly', () => {
        expect(getRunningTasks().length).toBe(0);

        taskRunner.startAll();

        expect(getRunningTasks().length).toBe(2);
    });

    test('it should only run once for a future Date', () => {
        const date = new Date();
        const clock = sinon.useFakeTimers(date.getTime());
        const seconds = date.getSeconds() + 10;

        date.setSeconds(seconds);

        taskRunner.register(date, () => taskThreeValue++);

        expect(taskThreeValue).toBe(0);

        expect(getRunningTasks().length).toBe(3);

        clock.tick(10000);

        expect(taskThreeValue).toBe(1);
        expect(getRunningTasks().length).toBe(2);
    });
});
