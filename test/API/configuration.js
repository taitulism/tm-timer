/* eslint-env jest */

const {
	Timer,
	THREE_SECONDS,
	emptyFn,
} = require('../common');

describe('Configuration', () => {
	let timer;

	beforeEach(() => {
		timer = new Timer(THREE_SECONDS);
	});

	afterEach(() => {
		timer = null;
	});

	describe('.set(duration)', () => {
		test('set time to count down', () => {
			expect(timer.duration).toEqual(THREE_SECONDS);
		});
	});

	describe('.whenDone(fn)', () => {
		test('set final callback', () => {
			timer.whenDone(emptyFn);

			expect(timer.done).toEqual(emptyFn);
		});
	});

	describe('.onTick(fn)', () => {
		test('set a tick callback', () => {
			timer.onTick(emptyFn);

			expect(timer.tickFn).toEqual(emptyFn);
		});
	});
});
