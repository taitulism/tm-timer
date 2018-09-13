const Ticker = require('tm-ticker');

const HALF_A_SECOND = 500;

class Timer {
	constructor (duration, whenDone) {
		this.ticker = new Ticker(HALF_A_SECOND, () => {
			this.tickHandler();
		});

		this.isWholeSecond = true;
		this.ref = null;

		duration && this.set(duration);
		whenDone && this.whenDone(whenDone);

		this.tickFn = null;
		this.halfSecFn = null;
	}

	set (duration) {
		this.duration = typeof duration === 'number'? duration : null;
	}

	whenDone (callback) {
		this.done = typeof callback === 'function' ? callback : null;
	}

	onTick (fn) {
		if (typeof fn === 'function') {
			this.tickFn = fn;
		}
	}

	onHalfTick (fn) {
		if (typeof fn === 'function') {
			this.halfSecFn = fn;
		}
	}

	tickHandler () {
		this.tickFn && this.tickFn(this.isWholeSecond);

		this.isWholeSecond = !this.isWholeSecond;
	}

	start () {
		if (this.isRunning) return;

		this.isRunning = true;

		this.ticker.start();

		this.ref = setTimeout(() => {
			this.stop();
			this.done();
		}, this.duration);
	}

	stop () {
		if (!this.isRunning) return;

		this.isRunning = false;

		this.ticker.stop();

		clearTimeout(this.ref);

		this.ref = null;
	}

	reset () {
		this.ticker.reset();
		this.isWholeSecond = true;

		if (this.isRunning) {
			this.stop();
			this.start();
		}
	}
}

module.exports = Timer;
