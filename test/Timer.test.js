/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const Timer = require('../');

const THREE_SECONDS = 3000;
const ALMOST_THREE_SECONDS = 2950;

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

function getConfiguredTimer () {
	const finalSpy = jest.fn();
	const oneSecondSpy = jest.fn();
	const halfSecondSpy = jest.fn();

	const timer = new Timer();

	timer.whenDone(finalSpy);
	timer.onTick(oneSecondSpy);
	timer.onHalfTick(halfSecondSpy);
	timer.set(THREE_SECONDS);

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

		describe('.stop()', () => {
			test('stops counting down', () => {
				jest.useFakeTimers();

				const timer = getTimerWithFinalCallback();

				timer.start();
				timer.stop();

				jest.runAllTimers();

				expect(timer.isRunning).toEqual(false);
			});

			test('does not call the final callback', (done) => {
				jest.useFakeTimers();

				const timer = getConfiguredTimer();

				timer.start();

				setTimeout(() => {
					timer.stop();

					setTimeout(() => {
						expect(timer.finalCallback).not.toHaveBeenCalled();
						done();
					}, 4000);
				}, 1000);

				jest.runAllTimers();
			});

			test('stop calling the one-second tick', (done) => {
				jest.useFakeTimers();

				const timer = getConfiguredTimer();

				timer.start();

				setTimeout(() => {
					expect(timer.oneSecFn).toHaveBeenCalledTimes(2);
					timer.stop();

					setTimeout(() => {
						expect(timer.oneSecFn).toHaveBeenCalledTimes(2);
						done();
					}, 2000);
				}, 1000);

				jest.runAllTimers();
			});

			test('stop calling the half-a-second tick', (done) => {
				jest.useFakeTimers();

				const timer = getConfiguredTimer();

				timer.start();

				setTimeout(() => {
					expect(timer.halfSecFn).toHaveBeenCalledTimes(2);
					timer.stop();

					setTimeout(() => {
						expect(timer.halfSecFn).toHaveBeenCalledTimes(2);
						done();
					}, 2000);
				}, 2000);

				jest.runAllTimers();
			});
		});

		describe('.reset()', () => {
			describe('when called while running', () => {
				test('start counting down with the same duration', () => {
					jest.useFakeTimers();

					const timer = getConfiguredTimer();

					timer.start();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.finalCallback).not.toHaveBeenCalled();

					timer.reset();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.finalCallback).not.toHaveBeenCalled();

					jest.advanceTimersByTime(50);
					expect(timer.finalCallback).toHaveBeenCalled();
				});
			});

			describe('when called after .stop()', () => {
				test('reset the timer', () => {
					jest.useFakeTimers();

					const timer = getConfiguredTimer();

					timer.start();

					jest.advanceTimersByTime(2500);
					timer.stop();
					timer.reset();

					jest.advanceTimersByTime(5000);

					timer.start();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.finalCallback).not.toHaveBeenCalled();
					jest.advanceTimersByTime(50);
					expect(timer.finalCallback).toHaveBeenCalled();
				});
			});
		});
	});
});
