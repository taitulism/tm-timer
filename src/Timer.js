const Ticker = require('tm-ticker');

const HALF_A_SECOND = 500;

/*
 * Private method. Called with a Timer instance as context of `this`.
 */
function tickHandler () {
	this.tickFn && this.tickFn(this.isWholeSecond);

	this.isWholeSecond = !this.isWholeSecond;
}

class Timer {
	constructor (duration, whenDone) {
		this.ticker = new Ticker(HALF_A_SECOND, () => {
			tickHandler.call(this);
		});

		this.isWholeSecond = true;
		this.ref = null;

		duration && this.set(duration);
		whenDone && this.whenDone(whenDone);

		this.tickFn = null;
		this.halfSecFn = null;
	}

	set (duration) {
		this.duration = typeof duration === 'number'
			? duration
			: null;

		return this;
	}

	whenDone (callback) {
		this.done = typeof callback === 'function'
			? callback
			: null;

		return this;
	}

	onTick (fn) {
		if (typeof fn === 'function') {
			this.tickFn = fn;
		}

		return this;
	}

	start () {
		if (this.isRunning) return;

		this.isRunning = true;

		this.ticker.start();

		this.ref = setTimeout(() => {
			this.stop();
			this.done && this.done();
		}, this.duration);

		return this;
	}

	stop () {
		if (!this.isRunning) return;

		this.isRunning = false;

		this.ticker.stop();

		clearTimeout(this.ref);

		this.ref = null;

		return this;
	}

	reset () {
		this.ticker.reset();
		this.isWholeSecond = true;

		if (this.isRunning) {
			this.stop();
			this.start();
		}

		return this;
	}
}

module.exports = Timer;
