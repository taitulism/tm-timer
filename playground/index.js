const Timer = require('../Timer');
	
const myTimer = new Timer(10000);

myTimer.onTick((countDown, timeLeft) => {
	const clock = `${countDown[0]}:${countDown[1]}:${countDown[2]}`;
	console.log(clock, timeLeft);
});

myTimer.onEnd(() => {
	console.log('*** Done ***');
});

myTimer.start();

setTimeout(() => {
	myTimer.stop();
	
	setTimeout(() => {
		myTimer.reset();
	}, 2000);
	setTimeout(() => {
		myTimer.start();
	}, 3000);
}, 3000);

/*
    // Somewhere down the road:
    myTimer.destroy();
*/
