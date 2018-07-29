const Ticker = require('ticker');
const getTimePeriodValues = require('./get-time-period-values');

class Timer {
	constructor (duration) {
		this.duration = duration;
		this.startTime = null;
		this.ticker = null;
	}
	
	start (now = Date.now()) {
		this.startTime = now;

		this.ticker = new Ticker(1000, (targetTime) => {
			this.tick(targetTime);
		});
		
		this.ticker.start(now);
	}

	tick (targetTime) {
		const now = Date.now();
		const timeLeft = this.startTime + this.duration - targetTime;

		if (timeLeft < 1000) {
			this.end();
		}
		else {
			const clockValues = getTimePeriodValues(timeLeft);

			if (typeof this.tickCallback === 'function') {
				this.tickCallback(clockValues, timeLeft);
			}
		}
	}

	end () {
		this.ticker.pause();
		this.ticker.reset();

		if (typeof this.endCallback === 'function') {
			this.endCallback();
		}
	}
	
	pause () {
		this.ticker.pause();
	}
	
	reset () {
		this.ticker.pause();
		this.ticker.reset();
	}

	onTick (callback) {
		if (typeof callback !== 'function') {
			throw new Error('Timer callback nust be a function');
		}

		this.tickCallback = callback;
	}
	
	onEnd (callback) {
		if (typeof callback !== 'function') {
			throw new Error('Timer callback nust be a function');
		}
		
		this.endCallback = callback;
	}
}

module.exports = Timer;
