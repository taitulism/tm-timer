/* eslint-disable
	no-console,
	no-magic-numbers,
	capitalized-comments
*/

const Timer = require('../');

const myTimer = new Timer(5000, () => {
	console.log('*** Done ***');
});

myTimer.onTick((isBigTick, timeLeft) => {
	if (!isBigTick) {
		return;
	}
	console.log('tick', timeLeft, myTimer.ticksLeft);
});

myTimer.start();

setTimeout(() => {
	myTimer.set(5000);
}, 3000);
