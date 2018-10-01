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

	describe('with an invalid duration or final callback', () => {
		test('throws an error on invalid duration', () => {
			function wrapper () {
				new Timer('not a number');
			}

			expect(wrapper).toThrow(Error);
		});

		test('throws an error on invalid final callback', () => {
			function wrapper () {
				new Timer(1000, 'not a function');
			}

			expect(wrapper).toThrow(Error);
		});
	});
});
