const ti = require('technicalindicators');

const periodCalculations = (options = {}) => {
    if (!options.tradeStore) {
        throw new Error('options.tradeStore is required');
    } (!options.session) {

    }

    const trades = options.tradeStore;

    return {
        sma(period) {

        }
    };
}

module.exports = periodCalculations;