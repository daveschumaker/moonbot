const ti = require('technicalindicators');
const adx = ti.adx;

// Calculate all technical indicators at the end of a period.
const allIndicators = function(session, tradeStore) {
    let calcs = {};

    return {
        adx(bars = 14) {
            let periods = tradeStore.get();
            let input = {
                close: [],
                high: [],
                low: [],
                period: bars
            };

            periods.forEach((obj) => {
                input.close.push(obj.close);
                input.high.push(obj.high);
                input.low.push(obj.low);
            });

            let results = adx(input);

            // Return most recent result
            return results.slice(-1)[0];
        },

        run() {
            calcs.adx = this.adx();

            return calcs;
        }
    }
};

module.exports = allIndicators;