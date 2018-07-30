const Ticker = require('ticker');
const getTimePeriodValues = require('./get-time-period-values');

class Timer {
	constructor (duration) {
		this.originalDuration = duration;
		this.duration = duration;
		this.startTime = null;
		this.ticker = null;
		this.isOn = false;
		this.isReset = true;
	}
	
	start (now = Date.now()) {
		if (this.isOn) return;

		this.isOn = true;
		this.isReset = false;
		
		this.startTime = now;

		this.ticker = this.ticker || new Ticker(1000, (targetTime) => {
			this.tick(targetTime);
		});
		
		this.ticker.start(now);
	}

	stop (now) {
		if (!this.isOn) return;

		this.isOn = false;

		now = now || Date.now();

		const timeLeft = this.startTime + this.duration - now;

		this.duration = timeLeft;
		this.ticker.stop(now);
	}

	reset (now) {
		if (this.isReset) return;

		now = now || Date.now();

		this.startTime = now;
		this.duration = this.originalDuration;

		this.ticker.reset(now);
	}

	tick (targetTime) {
		if (!this.isOn) return;

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
		this.isOn = false;
		
		this.ticker.stop();
		
		if (typeof this.endCallback === 'function') {
			this.endCallback();
		}
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
