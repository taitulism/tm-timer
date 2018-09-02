# Timer
**PROJECT STATUS:** Just got started. Work in progress...  
**CURRENT VERSION:** `0.0.0`  
**FOLLOWS SEMVER:** Not yet.  
**DEFAULT BRANCH:** `develop`  

## Timer
An accurate simple Timer (count down) class based on [Ticker](https://github.com/taitulism/ticker) (no GUI)


## Installation
> **Work in progress...**
```js
import Timer from 'Timer';
// or
const Timer = require('Timer');
```


## Usage
Create:
```js 
const fiveMinutes = 5 * 60 * 1000;

const t = new Timer(fiveMinutes);
```
Use:
```js
// bind events
 t.onTick(callback_A) // every second
 t.onEnd(callback_B)
 
 // future feature - blink your colons here (04:20)
 t.onHalfTick(callback_C)
```
```js
 t.start()
```
```js
 t.stop()
```
```js
 t.reset()
```

### Event callbacks
**`.onTick(callback)`**
* `callback` (function, required) - Runs every second. The first tick happens on start, synchronously, before any timeout. The callback function recieves two arguments:
    * `clockValues` - Time left array: `[hours, minutes, seconds]`.
    * `timeLeft` - Time left in milliseconds.
    
```js
t.onTick((clockValues, timeLeft) => {
    console.log(clockValues); //  | [0, 0, 5] | [0, 0, 4] | [0, 0, 3] |...
    console.log(timeLeft);    //  | 5000      | 4000      | 3000      |...
});
```

**`.onEnd(callback)`**
* `callback` (function, required) - Runs when timer finishes. No arguments.

```js
t.onEnd(() => {
    console.log("Time's Up!");
});
```
