const ti = require('technicalindicators');
const trimPeriodsArray = require('../../utils/trimPeriodsArray');
ti.setConfig('precision', 8);

const macd = ti.macd;

let macdArray = [];

const macdCalc = ({
        array = [],
        periodId,
        fastPeriod = 8,
        slowPeriod = 20,
        signalPeriod = 5
    }) => {

    if (array.length === 0) {
        return [];
    }

    let values = trimPeriodsArray({
        array: array,
        periodId: periodId
    }).map((obj) => {
        return obj.close;
    });

    // Give the RSI calculation more elements in array than simply our desired period.
    // Because just slicing at period length will always return 0.
    // values = values.slice(-28);

    let macdResult = macd({
        values,
		fastPeriod,
		slowPeriod,
		signalPeriod,
		SimpleMAOscillator: false,
		SimpleMASignal: false
    });

    if (macdResult.length > 0) {
        let result = macdResult.slice(-1)[0];

        result.MACD = Number(result.MACD).toFixed(9);
        result.signal = Number(result.signal).toFixed(9);
        result.histogram = Number(result.histogram).toFixed(9);

        // Store the two most recent macd calculations
        // in order to check for cross over.
        macdArray.push(result);
        macdArray = macdArray.slice(-2);

        return macdArray;
    } else {
        return [];
    }
}

module.exports = macdCalc;