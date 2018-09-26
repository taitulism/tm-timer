const lolex = require('lolex');

const {
	ALMOST_THREE_SECONDS,
	MORE_THAN_THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.getTimeLeft()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install({
			shouldAdvanceTime: true,
		});
	});

	afterEach(() => {
		clock.reset();
	});

	test('cannot be started again', () => {

		timer.destroy();
	});
});
