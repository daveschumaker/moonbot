const ti = require('technicalindicators');
const trimPeriodsArray = require('../../utils/trimPeriodsArray');

const rsiCalc = ti.rsi;

const rsi = (periodId, periodLength, array = []) => {
    if (array.length === 0) {
        return '--';
    }

    let values = trimPeriodsArray({
        array: array,
        periodId: periodId
    }).map((obj) => {
        return obj.close;
    });

    // Give the RSI calculation more elements in array than simply our desired period.
    // Because just slicing at period length will always return 0.
    values = values.slice(-(periodLength + 2));

    let rsiResult = rsiCalc({
        values,
        period: 14  // Traditionally, RSI period is 14. Make this customizable though...
    });

    if (rsiResult.length > 0) {
        return Number(rsiResult.slice(-1)).toFixed(0);
    } else {
        return '...';
    }
}

module.exports = rsi;