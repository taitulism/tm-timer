const START_TICK = 1;
const HALF_A_SECOND = 500;

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

module.exports = {
	tickHandler,
	convertDurationToTicks,
	hasTicksLeft,
};
