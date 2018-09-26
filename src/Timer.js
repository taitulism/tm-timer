const Ticker = require('tm-ticker');

const {START_TICK} = require('./common');

const {
	tickHandler,
	hasTicksLeft,
	convertDurationToTicks,
	convertTicksToDuration,
} = require('./private-methods');

const HALF_A_SECOND = 500;
const getNow = () => Date.now();

class Timer {
	constructor (duration, whenDone) {
		this.isRunning = false;
		this.isBigTick = true;
		this.isOk = true;
		this.ticksLeft = null;
		this.tickFn = null;
		this.done = null;
		this.duration = null;

		duration && this.set(duration);
		whenDone && this.whenDone(whenDone);

		this.ticker = new Ticker(HALF_A_SECOND, tickHandler.bind(this));
	}

	set (duration) {
		const calledWhileRunning = this.isRunning;

		if (calledWhileRunning) {
			this.stop().reset();
		}

		if (typeof duration === 'number') {
			this.duration = duration;
			this.ticksLeft = convertDurationToTicks(duration);
		}

		return calledWhileRunning
			? this.start()
			: this;
	}

	whenDone (callback) {
		if (typeof callback === 'function') {
			this.done =	callback;
		}

		return this;
	}

	onTick (fn) {
		if (typeof fn === 'function') {
			this.tickFn = fn;
		}

		return this;
	}

	start (now = getNow()) {
		if (this.isRunning || !hasTicksLeft(this) || !this.isOk) {
			return this;
		}

		this.isRunning = true;

		this.ticker.start(now);

		return this;
	}

	getTimeLeft () {
		const rounded = convertTicksToDuration(this.ticksLeft - START_TICK);
		const toNextTick = this.ticker.getTimeLeft();

		return rounded + toNextTick;
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
		this.stop().reset();

		this.isOk = false;
	}
}

module.exports = Timer;
