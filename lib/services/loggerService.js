const colors = require('colors');

let logTickerHistory = [];

const logTicker = (tickerObj) => {
    let timestamp = new Date(tickerObj.timestamp);
    let priceChangePct = tickerObj.priceChangePct < 0 ?
        colors.red(tickerObj.priceChangePct + '%') :
        colors.green(tickerObj.priceChangePct + '%')

    const tickerArray = [
        colors.blue(timestamp.toLocaleString()),
        tickerObj.closePrice.toFixed(8) + ' ' + tickerObj.symbol,
        priceChangePct
    ];

    console.log(tickerArray.join('  '));
}

module.exports = {
    logTicker
}


// 0.00016824
0.00016899