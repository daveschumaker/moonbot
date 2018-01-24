const Period = function({
    periodId = '',
    time = 0,
    price = 0,  // Should probably remove this...

    open = 0,
    high = 0,
    close = 0,
    low = 0,
    volume = 0
} = {}) {
    return {
        periodId: String(periodId),
        time: Number(time),      // Closing Time
        price: Number(price),    // Closing Price

        open: Number(open),
        high: Number(high),
        close: Number(close),
        low: Number(low),
        volume: Number(volume)
    };
};

module.exports = Period;