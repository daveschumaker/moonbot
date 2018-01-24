const macd = require('../calculations/macd');
const Strategy = require('./Strategy');

class macdStrategy extends Strategy {
    constructor({ config, session, tradeStore }) {
        super();

        this.config = config;
        this.session = session;
        this.tradeStore = tradeStore;
    }

    calculate() {
        const currentPeriodId = this.session.periodId();

        let macdResults = macd({
            array: this.tradeStore.get(),
            periodId: currentPeriodId,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
        });

        if (macdResults.length === 2) {
            if (macdResults[0].histogram < 0 && macdResults[1].histogram > 0) {
                this.signal = 'BUY'
            } else if (macdResults[0].histogram > 0 && macdResults[1].histogram < 0) {
                this.signal = 'SELL'
            }
        }

        return {
            signal: this.signal
        }
    }
}

module.exports = macdStrategy;