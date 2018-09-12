/* eslint-disable no-console, no-magic-numbers */

const Timer = require('../');

const myTimer = new Timer();

 let counter = 0;

myTimer.onTick(() => {
	console.log('tick', counter++);
});

// myTimer.onHalfTick(() => {
// 	console.log('tock');
// });

myTimer.whenDone(() => {
	console.log('*** Done ***');
});

myTimer.set(10000)

myTimer.start();

setTimeout(() => {
	console.log('reset');
	myTimer.reset();
}, 3500);
