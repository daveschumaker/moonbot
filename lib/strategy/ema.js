const checkEmaCrossover = require('../calculations/emaCrossover');
const Strategy = require('./Strategy');
const ti = require('technicalindicators');
const trimPeriods = require('../utils/trimPeriodsArray');
ti.setConfig('precision', 8);

const ema = ti.ema;
let emaArray = [];

class emaCrossoverStrategy extends Strategy {
    constructor({ config, session, tradeStore }) {
        super();

        this.config = config;
        this.session = session;
        this.tradeStore = tradeStore;
    }

    calculate() {
        const getPeriods = trimPeriods({
            array: this.tradeStore.get(100),
            periodId: this.session.periodId()
        });

        getPeriods.forEach((period) => {
            this.closes.push(period.close);
            this.highs.push(period.high);
            this.lows.push(period.low);
        });

        // Note:
        // A rolling EMA window requires more data than an SMA window, otherwise, averages will be the same.
        // So, if you want to calculate EMA with a period of 20, you need to provide an array of length 21+.
        const shortEma = ema({period: 10, values: this.closes}).slice(-1)[0] || null;
        const longEma = ema({period: 20, values: this.closes}).slice(-1)[0] || null;

        emaArray.push([shortEma, longEma]);
        emaArray = emaArray.slice(-2); // Keep array to the 2 most recent since that's what we're comparing.

        this.signal = checkEmaCrossover(emaArray);

        return {
            signal: this.signal
        }
    }
}

module.exports = emaCrossoverStrategy;