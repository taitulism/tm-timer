/* eslint-env jest */
/* eslint-disable max-lines-per-function */

const Timer = require('../');

const THREE_SECONDS = 3000;
const ALMOST_THREE_SECONDS = 2950;

const emptyFn = () => {}; // eslint-disable-line no-empty-function

function getBasicTimer (duration = THREE_SECONDS) {
	const timer = new Timer(duration);

	return timer;
}

function getTimerWithFinalCallback (done = emptyFn) {
	const timer = getBasicTimer();

	timer.whenDone(done);

	return timer;
}

function getSpyTimer () {
	const finalSpy = jest.fn();
	const tickSpy  = jest.fn();

	const timer = new Timer(THREE_SECONDS);

	timer.whenDone(finalSpy);
	timer.onTick(tickSpy);
	// timer.set(THREE_SECONDS);

	return timer;
}

describe('Timer', () => {
	describe('Creation', () => {
		describe('Empty', () => {
			test('created without error', () => {
				expect(() => {
					new Timer(); // eslint-disable-line no-new
				}).not.toThrow();

				const timer = new Timer();

				expect(timer instanceof Timer).toBeTruthy();
			});
		});

		describe('with duration and final callback', () => {
			test('set duration and final callback', () => {
				const timer = new Timer(THREE_SECONDS, emptyFn);

				expect(timer.duration).toEqual(THREE_SECONDS);
				expect(timer.done).toEqual(emptyFn);
			});
		});
	});

	describe('Configuration', () => {
		describe('.set(duration)', () => {
			test('set time to count down', () => {
				const timer = new Timer();

				timer.set(THREE_SECONDS);

				expect(timer.duration).toEqual(THREE_SECONDS);
			});
		});

		describe('.whenDone(fn)', () => {
			test('set final callback', () => {
				const timer = new Timer();

				timer.whenDone(emptyFn);

				expect(timer.done).toEqual(emptyFn);
			});
		});

		describe('.onTick(fn)', () => {
			test('set a tick callback', () => {
				const timer = new Timer();

				timer.onTick(emptyFn)

				expect(timer.tickFn).toEqual(emptyFn);
			});


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

			test('tick callback runs every 500ms', (done) => {
				jest.useFakeTimers();

				const spy = jest.fn();
				let count = 0;

				const timer = new Timer(THREE_SECONDS);

				timer.onTick(spy);

				timer.start();
				expect(spy).toHaveBeenCalledTimes(1);
				jest.advanceTimersByTime(500);
				expect(spy).toHaveBeenCalledTimes(2);
				jest.advanceTimersByTime(500);
				expect(spy).toHaveBeenCalledTimes(3);
				jest.advanceTimersByTime(500);
				expect(spy).toHaveBeenCalledTimes(4);
				jest.advanceTimersByTime(500);
				expect(spy).toHaveBeenCalledTimes(5);

				jest.clearAllTimers();
			});

			test('call the tick function with a whole/half second flag (true = whole)', (done) => {
				jest.useFakeTimers();

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

				jest.runAllTimers();
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

				const timer = getSpyTimer();

				timer.start();

				setTimeout(() => {
					timer.stop();

					setTimeout(() => {
						expect(timer.done).not.toHaveBeenCalled();
						done();
					}, 4000);
				}, 1000);

				jest.runAllTimers();
			});

			test('stop calling the tick function', () => {
				jest.useFakeTimers();

				const timer = getSpyTimer();
				// const spy = jest.fn();

				// timer.onTick = (() => {
				// 	console.log(123);
				// 	spy()
				// })

				timer.start();
				expect(timer.tickFn).toHaveBeenCalledTimes(1);
				// console.log(timer.tickFn.mock.calls);

				jest.advanceTimersByTime(3000);
				// console.log(timer.tickFn.mock.calls);
				expect(timer.tickFn).toHaveBeenCalledTimes(5);

				// setTimeout(() => {
				// 	timer.stop();

				// 	setTimeout(() => {
				// 		expect(timer.tickFn).toHaveBeenCalledTimes(2);
				// 		done();
				// 	}, 2000);
				// }, 1000);

				// jest.runAllTimers();
				jest.useRealTimers();
			});
		});

		describe('.reset()', () => {
			describe('when called while running', () => {
				test('start counting down with the same duration', () => {
					jest.useFakeTimers();

					const timer = getSpyTimer();

					timer.start();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.done).not.toHaveBeenCalled();

					timer.reset();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.done).not.toHaveBeenCalled();

					jest.advanceTimersByTime(50);
					expect(timer.done).toHaveBeenCalled();
				});
			});

			describe('when called after .stop()', () => {
				test('reset the timer', () => {
					jest.useFakeTimers();

					const timer = getSpyTimer();

					timer.start();

					jest.advanceTimersByTime(2500);
					timer.stop();
					timer.reset();

					jest.advanceTimersByTime(5000);

					timer.start();

					jest.advanceTimersByTime(ALMOST_THREE_SECONDS);
					expect(timer.done).not.toHaveBeenCalled();
					jest.advanceTimersByTime(50);
					expect(timer.done).toHaveBeenCalled();
				});
			});
		});
	});
});
