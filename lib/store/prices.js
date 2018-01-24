const calcPriceChange = require('../calculations/priceChange');

let state = {
    lastPrice: 0,
    lastClose: 0,
    priceHistory: []
}

const fixPercentageChange = (tickerObj = {}) => {
    let newPriceChangePct;
    let previousTicker

    if (state.priceHistory.length > 0) {
        previousTicker = state.priceHistory.slice(-1);
        newPriceChangePct = calcPriceChange(previousTicker[0].closePrice, tickerObj.closePrice);
        tickerObj.priceChangePct = newPriceChangePct;
    }

    return tickerObj;
}

const prices = {
    fetch(range = 0) {
        return state.priceHistory.slice(-range);
    },

    push(tickerObj = {}) {
        state.lastPrice = tickerObj.lastPrice;
        state.lastClose = tickerObj.lastClose;
        tickerObj = fixPercentageChange(tickerObj);

        state.priceHistory.push(tickerObj);
        return;
    }
};

module.exports = prices;