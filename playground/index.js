const Timer = require('../Timer');
	
const myTimer = new Timer(10000);

myTimer.onTick((countDown, timeLeft) => {
	const clock = `${countDown[0]}:${countDown[1]}:${countDown[2]}`;
	console.log(clock);
});

myTimer.onEnd(() => {
	console.log('*** Done ***');
});

myTimer.start();

setTimeout(() => {
	myTimer.pause();

	setTimeout(() => {
		myTimer.start();
	}, 3000);
}, 5900);

/*
    // Somewhere down the road:
    myTimer.pause();
    myTimer.reset();
    myTimer.destroy();
*/
