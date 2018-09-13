/* eslint-disable no-console, no-magic-numbers */

const Timer = require('../');

const myTimer = new Timer();

 let counter = 0;

myTimer.onTick((bool) => {
	console.log('tick', bool, counter++);
});

myTimer.whenDone(() => {
	console.log('*** Done ***');
});

myTimer.set(10000)

myTimer.start();

setTimeout(() => {
	console.log('reset');
	counter = 0;
	myTimer.reset();
}, 3500);
