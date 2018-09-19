/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const {
	Timer,
	THREE_SECONDS,
	emptyFn,
} = require('../common');

describe('Configuration', () => {
	let timer;

	beforeEach(() => {
		timer = new Timer();
	});

	afterEach(() => {
		timer = null;
	});

	describe('.set(duration)', () => {
		test('set time to count down', () => {
			timer.set(THREE_SECONDS);

			expect(timer.duration).toEqual(THREE_SECONDS);
		});

		test('return instance', () => {
			const returnValue = timer.set(THREE_SECONDS);

			expect(returnValue).toBe(timer);
		});
	});

	describe('.whenDone(fn)', () => {
		test('set final callback', () => {
			timer.whenDone(emptyFn);

			expect(timer.done).toEqual(emptyFn);
		});

		test('return instance', () => {
			const returnValue = timer.whenDone(emptyFn);

			expect(returnValue).toBe(timer);
		});
	});

	describe('.onTick(fn)', () => {
		test('set a tick callback', () => {
			timer.onTick(emptyFn);

			expect(timer.tickFn).toEqual(emptyFn);
		});

		test('return instance', () => {
			const returnValue = timer.onTick(emptyFn);

			expect(returnValue).toBe(timer);
		});
	});
});
