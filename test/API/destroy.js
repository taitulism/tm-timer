const lolex = require('@sinonjs/fake-timers');

const {
	ALMOST_THREE_SECONDS,
	MORE_THAN_THREE_SECONDS,
	getSpyTimer,
} = require('../common');

describe('.destroy()', () => {
	let clock;

	beforeEach(() => {
		clock = lolex.install();
	});

	afterEach(() => {
		clock.uninstall();
	});

	test('cannot be started again', () => {
		const timer = getSpyTimer().start();

		clock.tick(ALMOST_THREE_SECONDS);

		expect(timer.isOk).toBeTruthy();
		timer.destroy();
		expect(timer.isOk).toBeFalsy();

		timer.start();
		clock.tick(MORE_THAN_THREE_SECONDS);
		expect(timer.done.mock.calls.length).toEqual(0);

		timer.destroy();
	});

	test('unless setting `.isOk` to true', () => {
		const timer = getSpyTimer().start();

		clock.tick(ALMOST_THREE_SECONDS);

		timer.destroy();
		timer.isOk = true;

		timer.start();
		clock.tick(MORE_THAN_THREE_SECONDS);
		expect(timer.done.mock.calls.length).toEqual(1);

		timer.destroy();
	});
});
