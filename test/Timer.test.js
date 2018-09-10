/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const Timer = require('../');

const THREE_SECONDS = 3000;

const emptyFn = () => {}; // eslint-disable-line no-empty-function

function getASetTimer (duration = THREE_SECONDS) {
	const timer = new Timer();

	timer.set(duration);

	return timer;
}

function getTimerWithFinalCallback (finalCallback = emptyFn) {
	const timer = getASetTimer();

	timer.whenDone(finalCallback);

	return timer;
}

describe('Timer', () => {
	describe('Creation', () => {
		test('Basic', () => {
			expect(() => {
				new Timer(); // eslint-disable-line no-new
			}).not.toThrow();

			const timer = new Timer();

			expect(timer instanceof Timer).toBeTruthy();
		});
	});

	describe('Configuration', () => {
		test('set time to count down', () => {
			const timer = new Timer();

			timer.set(THREE_SECONDS);

			expect(timer.duration).toEqual(THREE_SECONDS);
		});

		test('set final callback', () => {
			const timer = getASetTimer();

			timer.whenDone(emptyFn);

			expect(timer.finalCallback).toEqual(emptyFn);
		});

		test('set one second callback', () => {
			const timer = getASetTimer();

			expect(timer.oneSecFn).toEqual(null);
			timer.onTick(emptyFn);
			expect(timer.oneSecFn).toEqual(emptyFn);
		});

		test('set half a second callback', () => {
			const timer = getASetTimer();

			expect(timer.halfSecFn).toEqual(null);
			timer.onHalfTick(emptyFn);
			expect(timer.halfSecFn).toEqual(emptyFn);
		});
	});

	describe('Usage', () => {
		describe('.start()', () => {
			test('starts running', () => {
				const timer = getTimerWithFinalCallback();

				timer.start();

				expect(timer.isRunning).toEqual(true);
			});

			test('calls the final callback when countdown is over', () => {
				jest.useFakeTimers();

				const spy = jest.fn();
				const timer = getTimerWithFinalCallback(spy);

				timer.start();
				jest.runAllTimers();

				expect(spy).toHaveBeenCalledTimes(1);
			});

			test('calls the one-second tick handler every second', () => {
				jest.useFakeTimers();

				const spy = jest.fn();
				const timer = getASetTimer();

				timer.onTick(spy);
				timer.whenDone(emptyFn);

				timer.start();
				jest.runAllTimers();

				expect(spy).toHaveBeenCalledTimes(4);
			});

			test('calls the half-a-second tick handler every 500ms', () => {
				jest.useFakeTimers();

				const spy = jest.fn();
				const timer = getASetTimer();

				timer.onHalfTick(spy);
				timer.whenDone(emptyFn);

				timer.start();
				jest.runAllTimers();

				expect(spy).toHaveBeenCalledTimes(3);
			});
		});
	});

});
