const lolex = require('lolex');

const {
	Timer,
	HALF_A_SECOND,
	THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.start()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install();
	});

	afterEach(() => {
		clock.reset();
	});

	test('return instance', () => {
		const timer = getSpyTimer();

		const returnValue = timer.start();

		expect(returnValue).toBe(timer);
	});

	test('starts running', () => {
		const timer = getSpyTimer().start();

		expect(timer.isRunning).toEqual(true);
	});

	test('tick callback runs every 500ms', () => {
		const spy = jest.fn();

		const timer = new Timer(THREE_SECONDS);

		timer.onTick(spy);

		expect(spy).toHaveBeenCalledTimes(0);
		timer.start(0);
		expect(spy).toHaveBeenCalledTimes(1);
		clock.tick(HALF_A_SECOND); // 500
		expect(spy).toHaveBeenCalledTimes(2);
		clock.tick(HALF_A_SECOND); // 1000
		expect(spy).toHaveBeenCalledTimes(3);
		clock.tick(HALF_A_SECOND); // 1500
		expect(spy).toHaveBeenCalledTimes(4);
		clock.tick(HALF_A_SECOND); // 2000
		expect(spy).toHaveBeenCalledTimes(5);
		clock.tick(HALF_A_SECOND); // 2500
		expect(spy).toHaveBeenCalledTimes(6);
		clock.tick(HALF_A_SECOND); // 3000
		expect(spy).toHaveBeenCalledTimes(7);
	});

	test('calls the final callback when countdown is over', () => {
		const timer = getSpyTimer();

		timer.start();
		clock.tick(THREE_SECONDS);

		expect(timer.done).toHaveBeenCalledTimes(1);
	});

	describe('tickHandler', () => {
		test('called with param 1: boolean (isBigTick)', (done) => {
			let odd = 0;
			let even = 0;

			const timer = new Timer(THREE_SECONDS, () => {
				expect(odd).toEqual(3);
				expect(even).toEqual(4);

				done();
			});

			timer.onTick((isBigTick) => {
				expect(typeof isBigTick).toBe('boolean');

				if (isBigTick) {
					even++;
				}
				else {
					odd++;
				}
			});

			timer.start(0);
			clock.tick(THREE_SECONDS);
		});

		test('called with param 2: number (timeLeft)', (done) => {
			const timer = new Timer(THREE_SECONDS, () => {
				done();
			});

			let previousTick = 0;

			timer.onTick((isBigTick, timeLeft) => {
				expect(typeof timeLeft).toBe('number');

				const now = Date.now();

				if (previousTick !== 0) {
					// Expect increment by 500
					expect(now - previousTick).toBeLessThanOrEqual(HALF_A_SECOND);
					expect(now - previousTick).toBeGreaterThan(HALF_A_SECOND - 2); // 498
				}

				previousTick = now;
			});

			timer.start(0);

			clock.tick(THREE_SECONDS);
		});
	});
});
