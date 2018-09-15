const Ticker = require('tm-ticker');

const HALF_A_SECOND = 500;
const START_TICK = 1;
const getNow = Date.now;

/*
 * Private method. Called with a Timer instance as context of `this`.
 */
function tickHandler () {
	const timeLeft = getTimeLeft(this.ticksLeft);

	this.tickFn && this.tickFn(this.isWholeSecond, timeLeft);

	this.isWholeSecond = !this.isWholeSecond;
	this.ticksLeft--;

	if (this.ticksLeft <= 0) {
		end(this);
	}
}

function end (timer) {
	timer.stop();
	timer.done && timer.done();
}

function getTimeLeft (ticksLeft) {
	return (ticksLeft - START_TICK) * HALF_A_SECOND;
}

function convertDurationToTicks (duration) {
	return (duration / HALF_A_SECOND) + START_TICK;
}

function hasTicksLeft (timer) {
	return timer.ticksLeft && timer.ticksLeft >= 0;
}


class Timer {
	constructor (duration, whenDone) {
		this.isRunning = false;
		this.isWholeSecond = true;
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
		if (this.isRunning || !hasTicksLeft(this)) return;

		this.isRunning = true;

		this.ticker.start(now);

		return this;
	}

	stop (now = getNow()) {
		if (!this.isRunning) return;

		this.isRunning = false;

		this.ticker.stop(now);

		return this;
	}

	reset (now = getNow()) {
		this.isWholeSecond = true;
		this.ticksLeft = convertDurationToTicks(this.duration);

		this.ticker.reset(now);

		if (this.isRunning) {
			this.stop(now);
			this.start(now);
		}

		return this;
	}
}

module.exports = Timer;
