/* eslint-env jest */

const {
	Timer,
	THREE_SECONDS,
	emptyFn,
} = require('./common');

describe('Creation', () => {
	describe('Empty', () => {
		test('created without error', () => {
			expect(() => {
				new Timer(); // eslint-disable-line
			}).not.toThrow();

			const timer = new Timer();

			expect(timer instanceof Timer).toBeTruthy();
		});
	});

	describe('with duration', () => {
		test('set duration and final callback', () => {
			const timer = new Timer(THREE_SECONDS);

			expect(timer.duration).toEqual(THREE_SECONDS);
		});
	});

	describe('with final callback', () => {
		test('set duration and final callback', () => {
			const timer = new Timer(THREE_SECONDS, emptyFn);

			expect(timer.done).toEqual(emptyFn);
		});
	});
});
