/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const lolex = require('lolex');

const {
	ALMOST_THREE_SECONDS,
	MORE_THAN_THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.reset()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install();
	});

	afterEach(() => {
		clock.uninstall();
	});

	describe('when called while running', () => {
		test('start counting down with the same duration', () => {
			const timer = getSpyTimer();

			timer.start();

			clock.tick(ALMOST_THREE_SECONDS);

			timer.reset();

			clock.tick(ALMOST_THREE_SECONDS);

			expect(timer.done).not.toHaveBeenCalled();
			clock.tick(50);
			expect(timer.done).toHaveBeenCalled();
		});
	});

	describe('when called after .stop()', () => {
		test('reset the timer', () => {
			const timer = getSpyTimer();

			timer.start();

			clock.tick(ALMOST_THREE_SECONDS);
			timer.stop();
			timer.reset();

			clock.tick(MORE_THAN_THREE_SECONDS);

			timer.start();

			clock.tick(ALMOST_THREE_SECONDS);
			expect(timer.done).not.toHaveBeenCalled();
			clock.tick(50);
			expect(timer.done).toHaveBeenCalled();
		});
	});
});
