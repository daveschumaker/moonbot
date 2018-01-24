/*
 * Random Trading Strategy
 * This is a simplified trading strategy that shows how trading strategies
 * can be put together. This particular strategy is very simple.
 * It gets a random number and sends a buy signal if lower than some
 * threshold and a sell signal if higher than some threshold.
 *
 * That's it! You can start building more complex trading strategies using
 * this pattern.
 */

const Strategy = require('./Strategy');

class randomStrategy extends Strategy {
    constructor({ config, session, tradeStore }) {
        super();

        this.config = config;
        this.session = session;
        this.tradeStore = tradeStore;
    }

    calculate() {
        const WHAT_IT_DO = Math.random();

        if (WHAT_IT_DO < .2) {
            this.signal = 'BUY'
        } else if (WHAT_IT_DO > .8) {
            this.signal = 'SELL';
        }

        return {
            signal: this.signal
        }
    }
}

module.exports = randomStrategy;