const Ticker = function({
    symbol = '',
    timestamp = 0,
    last = 0,
    info = {}
} = {}) {
    return {
        symbol: String(symbol),
        timestamp: Number(timestamp),
        askPrice: Number(info.askPrice),
        bidPrice: Number(info.bidPrice),
        closePrice: Number(info.prevClosePrice),
        lastPrice: Number(last),
        priceChange: Number(info.priceChange),
        priceChangePct: Number(info.priceChangePercent).toFixed(2)
    };
};

module.exports = Ticker;