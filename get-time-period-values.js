function getTimePeriodValues (duration) {
	if (duration <= 0) {
		return [0, 0, 0];
	}

	let seconds;

	seconds = ms2seconds(duration);
	seconds = Math.floor(seconds);

	if (seconds > 59) {
		seconds = seconds % 60;
	}

	let minutes;

	minutes = ms2minutes(duration);
	minutes = Math.floor(minutes);

	if (minutes > 59) {
		minutes = minutes % 60;
	}

	let hours;

	hours = ms2hours(duration);
	hours = Math.floor(hours);

	if (hours > 23) {
		hours = hours % 24;
	}

	return [hours, minutes, seconds];
}

module.exports = getTimePeriodValues;

function ms2seconds (ms) {
	return ms / 1000;
}
function ms2minutes (ms) {
	return ms / 1000 / 60;
}
function ms2hours (ms) {
	return ms / 1000 / 60 / 60;
}

