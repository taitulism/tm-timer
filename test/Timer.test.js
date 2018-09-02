const Timer = require('../');

test('Timer', () => {
	const timer = new Timer();

	expect(timer).toBeInstanceOf(Timer);
});
