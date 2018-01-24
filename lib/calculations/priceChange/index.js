const calcPriceChange = (price1, price2) => {
    let pct = ((price2 - price1) / price1) * 100;

    return pct.toFixed(2);
}

module.exports = calcPriceChange