/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const lolex = require('lolex');

const {
	Timer,
	ALMOST_THREE_SECONDS,
	MORE_THAN_THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.stop()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install();
	});

	afterEach(() => {
		clock.uninstall();
	});

	test('return instance', () => {
		const timer = getSpyTimer().start();

		const returnValue = timer.stop();

		expect(returnValue).toBe(timer);
	});

	test('stops counting down', () => {
		const timer = new Timer().start().stop();

		clock.runAll();

		expect(timer.isRunning).toEqual(false);
	});

	test('does not call the final callback', () => {
		const timer = getSpyTimer().start();

		clock.tick(ALMOST_THREE_SECONDS);
		timer.stop();
		clock.tick(MORE_THAN_THREE_SECONDS);

		expect(timer.done).not.toHaveBeenCalled();
	});

	test('stop calling the tick function', () => {
		const timer = getSpyTimer();
		const spy = jest.fn();

		timer.onTick(spy).start(0);

		clock.tick(ALMOST_THREE_SECONDS);
		expect(timer.tickFn).toHaveBeenCalledTimes(6);
		timer.stop();

		clock.tick(MORE_THAN_THREE_SECONDS);
		expect(timer.tickFn).toHaveBeenCalledTimes(6);
	});
});
