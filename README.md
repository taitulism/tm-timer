# Just got started. Work in progress...

## Timer
An accurate simple Timer class based on [Ticker](https://github.com/taitulism/ticker)


```js
const Timer = require('timer');

const endCallback = ;

const sixMinutes = 6 * 60 * 1000;

const myTimer = new Timer(sixMinutes);

// first tick occures immediately on start (no interval)
myTimer.onTick((clockValues, timeLeft) => {
    console.log(clockValues); // [0, 0, 6] --> [hours, minutes, seconds]
    console.log(timeLeft);    // 6000      --> ms
});

myTimer.onEnd(() => {
    console.log("Time's Up!");
});

// optional future feature
myTimer.onHalfTick = (toggleFlag) => {
    console.log("1/2 second tick");

    // blink your colons here (04:20)
    if (toggleFlag) {
        // whole second, show colons
    }
    else {
        // half a second, hide colons
    }
};

myTimer.start();

/*
    // Somewhere down the road:
    myTimer.pause();
    myTimer.reset();
    myTimer.destroy();
*/
```
