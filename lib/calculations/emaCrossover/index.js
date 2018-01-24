const checkEmaCrossover = (array = []) => {
    let signal;

    // Validation stuff.
    if (!array[0] || !array[1]) {
        return false;
    }

    const lastCalc = array[0];
    const currentCalc = array[1];
    const hasData = lastCalc[0] && lastCalc[1] && currentCalc[0] && currentCalc[1];
    if (!(hasData)) {
        return;
    }

    if (lastCalc[0] > lastCalc[1] && currentCalc[0] < currentCalc[1]) {
        console.log('SELL SIGNAL...');
        signal = 'SELL';
    } else if (lastCalc[0] < lastCalc[1] && currentCalc[0] > currentCalc[1]) {
        console.log('BUY SIGNAL...');
        signal = 'BUY';
    } else {
        signal = false;
    }

    return signal;
};

module.exports = checkEmaCrossover;