const Timer = require('../');

test('Timer', () => {
    const t = new Timer();

    expect(t).toBeInstanceOf(Timer);
});