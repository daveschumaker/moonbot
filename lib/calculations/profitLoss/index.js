const colors = require('colors');
const numbro = require('numbro');

const calcProfitLoss = ({sessionDetails, price} = {}) => {
    const { assets, capital, start } = sessionDetails;
    const startingAssets = start.assets;
    const startingCapital = start.capital;

    const currentTotal = capital + (price * assets);
    let profit = ((currentTotal - startingCapital) / startingCapital);

    if (profit === Infinity) {
        return colors.green('0.00%');
    }

    let result = numbro(profit).format('0.00%');

    if (profit > 0) {
        result = colors.green('+' + result);
    } else if (profit < 0) {
        result = colors.red(result);
    } else {
        result = colors.green('0.00%');
    }

    return result;
}

module.exports = calcProfitLoss;