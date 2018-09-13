/* eslint-env jest */
/* eslint-disable max-statements, max-lines-per-function */

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
		clock.uninstall();
	});

	test('starts running', () => {
		const timer = getSpyTimer();

		timer.start();

		expect(timer.isRunning).toEqual(true);
	});

	test('tick callback runs every 500ms', () => {
		const spy = jest.fn();

		const timer = new Timer(THREE_SECONDS);

		timer.onTick(spy);

		expect(spy).toHaveBeenCalledTimes(0);
		timer.start();
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

	test('tick handler is called with a flag', (done) => {
		let odd  = 0;
		let even = 0;

		const timer = new Timer(THREE_SECONDS, () => {
			expect(odd).toEqual(3);
			expect(even).toEqual(4);

			done();
		});

		timer.onTick((isWholeSecond) => {
			if (isWholeSecond) {
				even++;
			}
			else {
				odd++;
			}
		});

		timer.start();
		clock.runAll();
	});

	test('calls the final callback when countdown is over', () => {
		const timer = getSpyTimer();

		timer.start();
		clock.runAll();

		expect(timer.done).toHaveBeenCalledTimes(1);
	});
});
