// Calculates Buy Hold return for the current period for comparison purposes.
const buyHold = ({sessionDetails, price} = {}) => {
    const colors = require('colors');
    const numbro = require('numbro');

    const { assets, capital, start } = sessionDetails;
    const startingAssets = start.assets;
    const startingCapital = start.capital;
    const startingPrice = start.price;

    if (startingPrice === 0) {
        return colors.green('0.00%');
    }

    const startingTotal = startingCapital + (startingPrice * startingAssets);
    const currentTotal = capital + (price * assets);

    // TODO: TAKEN FROM ZENBOT. THIS SEEMS WRONG.
    const curBh = price * (startingTotal / startingPrice)
    const bhPct = (currentTotal - curBh) / curBh;

    let bhResult = numbro(bhPct).format('0.00%');

    if (bhPct > 0) {
        bhResult = colors.green('+' + bhResult);
    } else if (bhPct < 0) {
        bhResult = colors.red(bhResult);
    } else {
        bhResult = colors.green('0.00%');
    }

    return bhResult;
}

module.exports = buyHold;