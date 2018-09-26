const lolex = require('lolex');

const {
	ALMOST_THREE_SECONDS,
	THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.getTimeLeft()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install();
	});

	afterEach(() => {
		clock.reset();
	});

	test('returns the number of milliseconds left', () => {
		const timer = getSpyTimer().start();

		clock.tick(ALMOST_THREE_SECONDS);

		const ExpectRemaining = THREE_SECONDS - ALMOST_THREE_SECONDS;

		expect(timer.getTimeLeft()).toEqual(ExpectRemaining);
	});
});
