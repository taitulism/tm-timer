const Ticker = require('tm-ticker');

const {
	tickHandler,
	convertDurationToTicks,
	hasTicksLeft,
} = require('./private-methods');

const HALF_A_SECOND = 500;
const getNow = () => Date.now();

class Timer {
	constructor (duration, whenDone) {
		this.isRunning = false;
		this.isBigTick = true;
		this.ticksLeft = null;
		this.tickFn = null;

		duration && this.set(duration);
		whenDone && this.whenDone(whenDone);

		this.ticker = new Ticker(HALF_A_SECOND, tickHandler.bind(this));
	}

	set (duration) {
		if (typeof duration === 'number') {
			this.duration = duration;
			this.ticksLeft = convertDurationToTicks(duration);
		}
		else {
			this.duration = null;
			this.ticksLeft = null;
		}

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

	start (now = getNow()) {
		if (this.isRunning || !hasTicksLeft(this)) {
			return this;
		}

		this.isRunning = true;

		this.ticker.start(now);

		return this;
	}

	stop (now = getNow()) {
		if (!this.isRunning) {
			return this;
		}

		this.isRunning = false;

		this.ticker.stop(now);

		return this;
	}

	reset (now = getNow()) {
		this.isBigTick = true;
		this.ticksLeft = convertDurationToTicks(this.duration);

		this.ticker.reset(now);

		if (this.isRunning) {
			this.stop(now);
			this.start(now);
		}

		return this;
	}

	destroy () {
		this.stop();
		this.reset();

		this.duration = null;
		this.ticksLeft = null;
		this.tickFn = null;
	}
}

module.exports = Timer;
