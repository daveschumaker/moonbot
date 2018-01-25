// Stuff to do at the end of every period.
const endPeriodTasks = function(config, executeOrder, session, tickerDetails, tradeStore) {
    const tickerOutput = require('../services/logger/tickerOutput');
    const trimPeriodsArray = require('../utils/trimPeriodsArray');
    const Strategy = require('../strategy/macd');

    let lastTime;
    let initLoad = true;

    return function() {
        const strategy = new Strategy({config, session, tradeStore});
        const settings = session.settings();
        const currentPeriodId = session.periodId();
        const recentPeriods = trimPeriodsArray({
            array: tradeStore.get(3),
            periodId: currentPeriodId
        });

        if (initLoad && recentPeriods.length < 2) {
            console.log('Waiting for enough trades to occur before calculations begin...\n');
            initLoad = false;
            return;
        } else if (recentPeriods.length < 2) {
            return;
        }

        let period0 = recentPeriods[0];
        let period1 = recentPeriods[1];

        // Analyze current numbers and look for buy / sell signals.
        let calcs = strategy.calculate(); // Analyzes current numbers.

        // TODO: Pass strat calculation above into ticker details?
        // e.g., we might want to calculate RSI and volume data in the strat itself.
        // TODO: Also detect if ticker has certain data. If not, don't show those rows?
        let tickerObj = tickerDetails.display();

        // This happens when there haven't been enough trades in the selected period.
        // Only an issue with really short timeframes or low volume tokens.
        const time = new Date(period1.time).toLocaleString();
        if (lastTime != time) {
            tickerOutput(tickerObj);
            lastTime = time;
        }

        // If valid signals are detected, execute pending orders.
		if (calcs.signal === 'BUY' && settings.enableOrders) {
			executeOrder.buy(period1.price)
		} else if (calcs.signal === 'SELL' && settings.enableOrders) {
			executeOrder.sell(period1.price)
		}
    };
};

module.exports = endPeriodTasks;