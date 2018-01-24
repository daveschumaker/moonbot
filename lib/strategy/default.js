// TODO: DELETE ME.

/*
 * A default example strategy to get started.
 *
 * Uses various indicators from the 'technicalindicators' package to
 * to generate buy or sell signals.
 */

const checkEmaCrossover = require('../calculations/emaCrossover');

let emaArray = [];

/**
 * @param {Object} options - Injected dependencies.
 * @param {Object} options.config - General configuration settings.
 */
const defaultStrategy = function(config, session, tradeStore) {

    let lows = [];
    let highs = [];
    let closes = [];

    return {
        calculate() {
			let signal = false;

            const adx = ti.adx;
            const ema = ti.ema;




            lows = [];
            highs = [];
            closes = [];

            getPeriods.forEach((period) => {
                closes.push(period.close);
                highs.push(period.high);
                lows.push(period.low);
            })

            // Note:
            // A rolling EMA window requires more data than an SMA window, otherwise, averages will be the same.
            // So, if you want to calculate EMA with a period of 20, you need to provide an array of length 21+.
            const ema20 = ema({period: 10, values: closes}).slice(-1)[0] || null;
            const ema50 = ema({period: 20, values: closes}).slice(-1)[0] || null;
            const adx14 = adx({
                low: lows,
                high: highs,
                close: closes,
                period: 14
            });

            const adxValu = adx14.slice(-1)[0] || {};

            emaArray.push([ema20, ema50]);
            emaArray = emaArray.slice(-2); // Keep array to the 2 most recent since that's what we're comparing.

            // signal = checkEmaCrossover(emaArray);

            /////////DEBUG
            let num = Math.random();
            if (num < .3) {
                signal = 'BUY'
            } else if (num > .7) {
                signal = 'SELL';
            }

            return {
                adx: adxValu.adx ? adxValu.adx.toFixed(0) : '',
                ema: (ema20 - ema50).toFixed(8),
                signal: signal
            };
        },
    }
}

module.exports = defaultStrategy;