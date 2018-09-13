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

	test('stops counting down', () => {
		const timer = new Timer();

		timer.start();
		timer.stop();

		clock.runAll();

		expect(timer.isRunning).toEqual(false);
	});

	test('does not call the final callback', () => {
		const timer = getSpyTimer();

		timer.start();
		clock.tick(ALMOST_THREE_SECONDS);
		timer.stop();
		clock.tick(MORE_THAN_THREE_SECONDS);

		expect(timer.done).not.toHaveBeenCalled();
	});

	test('stop calling the tick function', () => {
		const timer = getSpyTimer();
		const spy = jest.fn();

		timer.onTick(spy);

		timer.start();

		clock.tick(ALMOST_THREE_SECONDS);
		expect(timer.tickFn).toHaveBeenCalledTimes(6);
		timer.stop();

		clock.tick(MORE_THAN_THREE_SECONDS);
		expect(timer.tickFn).toHaveBeenCalledTimes(6);
	});
});
