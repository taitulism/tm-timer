const Timer = require('../');

const HALF_A_SECOND = 500;
const ALMOST_THREE_SECONDS = 2950;
const THREE_SECONDS = 3000;
const MORE_THAN_THREE_SECONDS = 7000;

const emptyFn = () => {}; // eslint-disable-line no-empty-function

function getSpyTimer () {
	const finalSpy = jest.fn();
	const tickSpy = jest.fn();

	const timer = new Timer(THREE_SECONDS);

	timer
		.whenDone(finalSpy)
		.onTick(tickSpy);

	return timer;
}

module.exports = {
	Timer,
	HALF_A_SECOND,
	ALMOST_THREE_SECONDS,
	THREE_SECONDS,
	MORE_THAN_THREE_SECONDS,
	emptyFn,
	getSpyTimer,
};
