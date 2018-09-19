# TM-Timer
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/tm-timer.svg?branch=develop)](https://travis-ci.org/taitulism/tm-timer)

A simple count-down Timer class, based on [TM-Ticker](https://github.com/taitulism/ticker) (no GUI)


## Installation
```sh
$ npm install tm-timer
```
```js
import Timer from 'tm-timer';
// or
const Timer = require('tm-timer');
```


## TL;DR
[Jump to API](#api)

#### Create:
```js
// construct & config
const t = new Timer(duration, finalCallback)

// or just construct (and config later)
const t = new Timer()
```


#### Config:
```js
t.set(duration)
t.whenDone(finalCallback)
t.onTick(tickHandler)
```


#### Use:
> `now` is optional
```js
 t.start(now)
```
```js
 t.stop(now)
```
```js
 t.reset(now)
```
```js
 t.destroy()
```



## API
------

## Constructor
```js 
const t = new Timer(duration, finalCallback);
```
* `duration` [number, optional*]  
\* *Required to start. optional at construction.*  
Countdown in milliseconds. Pass `null` to set the callback alone.

* `finalCallback` [function, optional]  
The function you want to call when countdown is over.

Example:
```js
const fiveMinutes = 5 * 60 * 1000;

const t = new Timer(fiveMinutes, () => {
    console.log('Game Over');
});
```

## Configuration
> **A Timer instance won't tick unless it has a duration.**  

You can set the timer's duration and final callback on construction or later with the following methods which are very self explanatory:

```js
const myTimer = new Timer();

myTimer.set(fiveMinutes)
myTimer.whenDone(finalCallback)
myTimer.onTick(myTickHandler)
```

### **`.set(duration)`**
* `duration` [number, required]  
Set the total time in milliseconds to count down to.

```js
const fiveMinutes = 5 * 60 * 1000;

myTimer.set(fiveMinutes);
```

### **`.whenDone(finalCallback)`**
* `finalCallback` [function, required]  
Runs when timer finishes. Gets no arguments.

```js
myTimer.whenDone(() => {
    console.log("Time's Up!");
});
```

### **`.onTick(callback)`**
As the timer counts down, it ticks every 500ms (twice every second).  
Use when you can bind a tick handler function.  
The first tick happens on start, synchronously, before any timeout.  
* `callback` [function, optional]  
The callback function recieves two arguments:
    1. `isBigTick` [boolean]  
        Equals `true` on "big" ticks (a whole second: 0, 1000, 2000, 3000 etc.)  
        Equals `false` on "small" ticks (half a second: 500, 1500, 2500, 3500 etc.)  
        For example, you could update your clock's digits on big ticks and blink the clock's colons on small ticks (04:20).

    2. `timeLeft` [number]  
    Time left in milliseconds.

Example:    
```js
myTimer.onTick((isBigTick, timeLeft) => {
    console.log(isBigTick); //  | true | false | true | false |...
    console.log(timeLeft);  //  | 5000 | 4500  | 4000 | 3500  |...

    /*
    * NOTE:
    * The following functions are made up and are not part of TM-Timer.
    */
    if (isBigTick) {
        updateClock(timeLeft)
        showColons() // (04:20)
    }
    else {
        hideColons() // (04 20)
    }
});
```


## Methods
All methods can get called with a `timestamp` argument. Pass in a current timestamp when you need to sync time with other modules.

* `timestamp` (ms, number, optional) - The timestamp to be considered as the method's execution time.

## .start()
Start counting down.

Calls the first tick (if a tick handler is set with `.onTick(fn)`).  
When called after a `.stop()` it acts as a "resume" function. There will be no start-tick in this case. 
```js
// optional
const timestamp = Date.now()

myTimer.start(timestamp)
```


## .stop()
Stop/Pause counting down.

Run `.start()` to resume.

```js
const myTimer = new Timer(fiveMinutes, gameOver)

myTimer.start()

// Take a break
myTimer.stop()

// Resume
myTimer.start()
```


## .reset()
Reset the countdown with full original duration.

Can be called whether the timer is running or not. When called while running, it acts like a "restart" and doesn't stop the timer.

```js
const myTimer = new Timer(fiveMinutes, gameOver)

myTimer.start()

/* after 2 minutes */
myTimer.reset() // re-start counting down five minutes. No stop.
```

```js
const myTimer = new Timer(fiveMinutes, gameOver)

myTimer.start()

/* after 2 minutes */
myTimer.stop()
myTimer.reset()
myTimer.start() // start counting down five minutes.
```

## .destroy()
Destroy the timer. Removes duration and bound callbacks.  

>Cannot be used again unless re-configured.

```js
const myTimer = new Timer(fiveMinutes, gameOver)

myTimer.start()
myTimer.destroy()

myTimer.set(fiveMinutes)
myTimer.whenDone(gameOver)
```

## Playground
-------------
```sh
$ npm run playground
```
