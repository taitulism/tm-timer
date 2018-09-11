const Ticker = require('tm-ticker');

const HALF_A_SECOND = 500;

class Timer {
	constructor () {
		this.ticker = new Ticker(HALF_A_SECOND, () => {
			this.tickHandler();
		});

		this.isOneSecTick = true;
		this.ref = null;

		this.duration = null;
		this.finalCallback = null;

		this.oneSecFn = null;
		this.halfSecFn = null;
	}

	set (duration) {
		this.duration = duration;
	}

	whenDone (callback) {
		this.finalCallback = callback;
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
		this.isRunning = true;

		this.ticker.start();

		this.ref = setTimeout(() => {
			this.stop();
			this.finalCallback();
		}, this.duration);
	}

	stop () {
		this.isRunning = false;

		this.ticker.stop();

		clearTimeout(this.ref);

		this.ref = null;
	}
}

module.exports = Timer;
