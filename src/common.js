const START_TICK = 1;
const HALF_A_SECOND = 500;

function memoize (fn) {
	const memo = Object.create(null);

	return function memoFn (...args) {
		if (!memo[args]) {
			memo[args] = fn(args);
		}

		return memo[args];
	};
}

module.exports.START_TICK = START_TICK;
module.exports.HALF_A_SECOND = HALF_A_SECOND;
module.exports.memoize = memoize;
