const Ticker = require('tm-ticker');

const HALF_A_SECOND = 500;

class Timer {
	constructor (duration, whenDone) {
		this.ticker = new Ticker(HALF_A_SECOND, () => {
			this.tickHandler();
		});

		this.isOneSecTick = true;
		this.ref = null;

		duration && this.set(duration);
		whenDone && this.whenDone(whenDone);

		this.oneSecFn = null;
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
			this.oneSecFn = fn;
		}
	}

	onHalfTick (fn) {
		if (typeof fn === 'function') {
			this.halfSecFn = fn;
		}
	}

	tickHandler () {
		if (this.isOneSecTick) {
			this.oneSecFn && this.oneSecFn();
		}
		else {
			this.halfSecFn && this.halfSecFn();
		}

		this.isOneSecTick = !this.isOneSecTick;
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
		this.isOneSecTick = true;

		if (this.isRunning) {
			this.stop();
			this.start();
		}
	}
}

module.exports = Timer;
