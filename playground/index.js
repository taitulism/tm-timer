/* eslint-disable
	no-console,
	no-magic-numbers,
	capitalized-comments
*/

const Timer = require('../');

const myTimer = new Timer(5000, () => {
	console.log('*** Done ***');
});

let counter = 0;

myTimer.onTick((isWholeSecondTick, timeLeft) => {
	if (!isWholeSecondTick) {
		return;
	}
	console.log('tick', counter++, timeLeft);
});

myTimer.start();

// setTimeout(() => {
// 	myTimer.stop();
// 	counter = 0;
// }, 3500);
