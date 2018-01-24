const Trade = function({
    id = '',
    symbol = '',
    timestamp = 0,
    amount = 0,
    price = 0
} = {}) {
    return {
        id: String(id),
        symbol: String(symbol),
        time: Number(timestamp),
        niceTime: new Date(timestamp).toLocaleString(),
        size: Number(amount),
        price: parseFloat(price)
    };
};

module.exports = Trade;