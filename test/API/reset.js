const lolex = require('@sinonjs/fake-timers');

const {
	ALMOST_THREE_SECONDS,
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

	test('return instance', () => {
		const timer = getSpyTimer().start();
		const returnValue = timer.reset();

		expect(returnValue).toBe(timer);
	});

	describe('when called while running', () => {
		test('start counting down with the same duration', () => {
			const timer = getSpyTimer();

			timer.start();

			clock.tick(ALMOST_THREE_SECONDS);
			timer.reset(ALMOST_THREE_SECONDS);
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
			timer.start(ALMOST_THREE_SECONDS);

			clock.tick(ALMOST_THREE_SECONDS);

			expect(timer.done).not.toHaveBeenCalled();
			clock.tick(50);
			expect(timer.done).toHaveBeenCalled();
		});
	});
});
